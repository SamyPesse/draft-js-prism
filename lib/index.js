var Immutable = require('immutable');
var Prism = require('prismjs');
var htmlEncode = require('js-htmlencode').htmlEncode;

var PrismOptions = require('./options');

var KEY_SEPARATOR = '-';

function PrismDecorator(options) {
    this.options = PrismOptions(options || {});
    this.highlighted = {};
}

/**
 * Return list of decoration IDs per character
 *
 * @param {ContentBlock}
 * @return {List<String>}
 */
PrismDecorator.prototype.getDecorations = function(block) {
    var tokens, token, tokenId, resultId, offset = 0;
    var filter = this.options.get('filter');
    var getSyntax = this.options.get('getSyntax');
    var blockKey = block.getKey();
    var blockText = block.getText();

    if (syntax === 'markup') {
        blockText = htmlEncode(blockText);
    }

    var decorations = Array(blockText.length).fill(null);

    this.highlighted[blockKey] = {};

    if (!filter(block)) {
        return Immutable.List(decorations);
    }

    var syntax = getSyntax(block) || this.options.get('defaultSyntax');

    // Allow for no syntax highlighting
    if (syntax == null) {
        return Immutable.List(decorations);
    }

    // Parse text using Prism
    var grammar = Prism.languages[syntax];

    tokens = Prism.tokenize(blockText, grammar);

    this.buildDecorations(decorations, tokens, offset, blockKey);

    return Immutable.List(decorations);
};


/**
 * Return component to render a decoration
 *
 * @param {String}
 * @return {Function}
 */
PrismDecorator.prototype.getComponentForKey = function(key) {
    return this.options.get('render');
};

/**
 * Return props to render a decoration
 *
 * @param {String}
 * @return {Object}
 */
PrismDecorator.prototype.getPropsForKey = function(key) {
    var parts = key.split('/');
    var blockKey = parts[0];
    var tokId = parts[1];
    var token = this.highlighted[blockKey][tokId];

    return {
        type: token.type
    };
};

/**
 * Builds the decorations array
 *
 * @param {List<String>} the initial decorations array
 * @param {List<Object|String>}
 * @param {Number}
 * @param {String}
 * @return {Number}
 */
PrismDecorator.prototype.buildDecorations = function(decorations, tokens, offset, blockKey) {
    var token = tokens[0];

    if (typeof token === 'string') {
        offset += token.length;
    } else {
        var tokenId = token.type+offset;
        var resultId = blockKey + '/' + tokenId;

        var start = offset;
        if (typeof token.content === 'string') {
            this.highlighted[blockKey][tokenId] = token;
            offset += token.content.length;
            occupySlice(decorations, start, offset, resultId);
        } else {
            this.highlighted[blockKey][tokenId] = token;
            offset = this.buildDecorations(decorations, token.content, offset, blockKey);
          if (token.content.length > 1) {
              replaceSlice(decorations, start, offset, resultId, null);
          } else {
              occupySlice(decorations, start, offset, resultId);
          }
        }
    }

    if (tokens.length > 1) {
        return this.buildDecorations(decorations, tokens.slice(1, tokens.length), offset, blockKey);
    }

    return offset;
};

function occupySlice(targetArr, start, end, componentKey) {
    for (var ii = start; ii < end; ii++) {
        targetArr[ii] = componentKey;
    }
}

function replaceSlice(targetArr, start, end, componentKey, replaceKey) {
    for (var ii = start; ii < end; ii++) {
        if(targetArr[ii] === replaceKey) targetArr[ii] = componentKey;
    }
}

module.exports = PrismDecorator;
