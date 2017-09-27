var Draft = require('draft-js');
var expect = require('expect');
var Prism = require('prismjs');

var PrismDecorator = require('../');

describe('PrismDecorator', function() {
    var jsBlock = new Draft.ContentBlock({
        type: 'code-block',
        text: 'var a = "test"'
    });

    it('should not fail for block without syntax', function() {
        var decorator = new PrismDecorator({
          prism: Prism,
        });
        var out = decorator.getDecorations(jsBlock);
        expect(out.toJS()).toEqual([
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null
        ]);
    });

    it('should use defaultSyntax option', function() {
        var decorator = new PrismDecorator({
            prism: Prism,
            defaultSyntax: 'javascript'
        });
        var out = decorator.getDecorations(jsBlock);
        expect(out.toJS()).toEqual([
            '-tok0', '-tok0', '-tok0',
            null, null, null,
            '-tok1', null,
            '-tok2', '-tok2', '-tok2', '-tok2', '-tok2', '-tok2' ]);
    });

    it('should use not process non code-block by default', function() {
        var block = new Draft.ContentBlock({
            type: 'unstyled',
            text: 'var'
        });
        var decorator = new PrismDecorator({
            prism: Prism,
            defaultSyntax: 'javascript'
        });
        var out = decorator.getDecorations(block);
        expect(out.toJS()).toEqual([
            null, null, null
        ]);
    });
});
