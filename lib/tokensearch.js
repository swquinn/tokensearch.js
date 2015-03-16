/*
 * tokensearch.js: simple string token collection search
 *
 * (C) 2015 Michael Vogt
 * MIT LICENSE
 *
 */
 var Tokensearch = function(_collection, options) {
  if (!_collection || _collection.length===0) {
    throw new Error('Empty collection!');
  }
  var self = this;
  this.collection = [];
  _collection.forEach(function(entry) {
    self.collection.push({ 'item': entry });
  });
  options = options || {};
  this.delimiter = options.delimiter || Tokensearch.defaultOptions.delimiter;
  this.maxFilterTokenEntries = options.maxFilterTokenEntries || Tokensearch.defaultOptions.maxFilterTokenEntries;
  this.defaultThreshold = options.threshold || Tokensearch.defaultOptions.threshold;
  this.collectionKeys = options.collectionKeys || Tokensearch.defaultOptions.collectionKeys;
  if (this.collectionKeys.length===0) {
    throw new Error('No collectionKeys defined!');
  }
  this.collectionDataTokenSize = this.collectionKeys.length;
  this._prepareSearchTokens();
};

Tokensearch.defaultOptions = {
  //split strings with a delimiters, can be a regex or a character
  delimiter: /[\s-]+/,

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.7,

  // How many search tokens are considered
  maxFilterTokenEntries: 5,

  // search key
  collectionKeys: []
};

Tokensearch.prototype._prepareSearchTokens = function() {
  var self = this;
  //Get all search tokens
  this.collection.forEach(function(entry) {
    var tmp = [];
    self.collectionKeys.forEach(function(key) {
      entry.item[key].trim().toLowerCase().split(self.delimiter).forEach(function(e) {
        tmp = tmp.concat(e);
      });
    });
    entry.dataEntryTokens = tmp.filter(self._onlyUnique);
  });

};

Tokensearch.prototype._onlyUnique = function(value, index, self) {
  return self.indexOf(value) === index;
};

/**
 * returns an sorted array of { 'item': OBJECT, 'score': score }
 * -item contains the input object
 * -score defines the match with the search term, 0 means perfect match, 1 means rubbish
 */
Tokensearch.prototype.search = function(token, customThreshold) {
  var searchTokens = [];
  var threshold = customThreshold || this.defaultThreshold;

  //make sure the search tokens contains no dups
  var tmp = token.trim().split(this.delimiter).filter(this._onlyUnique);
  for (var i = 0, len = Math.min(tmp.length, this.maxFilterTokenEntries); i < len; i++) {
    searchTokens.push(tmp[i].toLowerCase());
  }

  var resultTmp = [];
  var maxScore = 0;
  this.collection.forEach(function(entry) {
    var score = 0;
    var tokensFound = 0;
    entry.dataEntryTokens.forEach(function(dataEntryToken) {
      var arrayLength = searchTokens.length;
      for (var i = 0; i < arrayLength; i++) {
        var searchToken = searchTokens[i];
        if (dataEntryToken.indexOf(searchToken) > -1) {
          tokensFound++;
          score += (dataEntryToken === searchToken) ? 2 : 1;
          break;
        }
      }
    });

    if (tokensFound) {
      score += tokensFound;
      if (score > maxScore) {
        maxScore = score;
      }
      resultTmp.push({ 'item': entry.item, 'score': score });
    }
  });

  var result = [];
  var normalizedScore = 1 / maxScore;
  resultTmp.forEach(function(r) {
    r.score = 1-r.score*normalizedScore;
    if (r.score <= threshold) {
      result.push(r);
    }
  });

  return result.sort(function(a, b) {
     return a.score - b.score;
  });
};

module.exports = Tokensearch;
