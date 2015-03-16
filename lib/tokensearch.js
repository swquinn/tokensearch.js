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
  this.collection = _collection;
  options = options || {};
  this.delimiterRegex = options.delimiterRegex || Tokensearch.defaultOptions.delimiterRegex;
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
  //split strings with those delimiters, default delimiters: space and dash
  delimiterRegex: /[\s-]+/,

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
      entry[key].trim().toLowerCase().split(self.delimiterRegex).forEach(function(e) {
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
  var self = this;
  var searchTokens = [];
  var threshold = customThreshold || this.defaultThreshold;

  //make sure the search tokens contains no dups
  var tmp = token.trim().split(this.delimiterRegex).filter(this._onlyUnique);
  for (var i = 0, len = Math.min(tmp.length, this.maxFilterTokenEntries); i < len; i++) {
    searchTokens.push(tmp[i].toLowerCase());
  }

  var resultTmp = [];
  var maxScore = 0;
  this.collection.forEach(function(entry) {
    var score = 0;
    var tokensFound = 0;
    entry.dataEntryTokens.forEach(function(dataEntryToken) {
      searchTokens.forEach(function(searchToken) {
        if (dataEntryToken.indexOf(searchToken) > -1) {
          tokensFound++;
          score += (dataEntryToken === searchToken) ? 2 : 1;
        }
      });
    });

    if (score) {
      score += tokensFound;
      if (score > maxScore) {
        maxScore = score;
      }
      resultTmp.push({ 'item': entry, 'score': score });
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
