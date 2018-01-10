var Immutable = require('immutable');

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
    var tokens, token, tokenId, resultId, offset = 0, tokenCount = 0;
    var filter = this.options.get('filter');
    var getSyntax = this.options.get('getSyntax');
    var blockKey = block.getKey();
    var blockText = block.getText();
    var decorations = Array(blockText.length).fill(null);
    var Prism = this.options.get('prism');
    var highlighted = this.highlighted;

    highlighted[blockKey] = {};

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


    function processToken(decorations, token, offset) {
      if (typeof token === 'string') {
        return
      }
      //First write this tokens full length
      tokenId = 'tok'+(tokenCount++);
      resultId = blockKey + '-' + tokenId;
      highlighted[blockKey][tokenId] = token;
      occupySlice(decorations, offset, offset + token.length, resultId);
      //Then recurse through the child tokens, overwriting the parent
      var childOffset = offset;
      for (var i =0; i < token.content.length; i++) {
        var childToken = token.content[i];
        processToken(decorations, childToken, childOffset);
        childOffset += childToken.length;
      }
    }

    var moveTokensToDecorations = tokensList => tokensList.forEach(token => {
      if (Array.isArray(token.content)) {
        moveTokensToDecorations(token.content);
      } else {
        processToken(decorations, token, offset);
        offset += token.length;
      }
    });

    moveTokensToDecorations(tokens);

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
    var parts = key.split('-');
    var blockKey = parts[0];
    var tokId = parts[1];
    var token = this.highlighted[blockKey][tokId];

    return {
        type: token.type
    };
};

function occupySlice(targetArr, start, end, componentKey) {
    for (var ii = start; ii < end; ii++) {
        targetArr[ii] = componentKey;
    }
}

module.exports = PrismDecorator;
