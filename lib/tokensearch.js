/*
 * tokensearch.js: simple string token collection search
 *
 * (C) 2015 Michael Vogt
 * MIT LICENSE
 *
 */
 var Tokensearch = function(collection, options) {
  this.collection = collection;
  options = options || {};
  this.delimiter = options.delimiter || Tokensearch.defaultOptions.delimiter;
  this.maxFilterTokenEntries = options.maxFilterTokenEntries || Tokensearch.defaultOptions.maxFilterTokenEntries;
  this.threshold = options.threshold || Tokensearch.defaultOptions.threshold;
  this.collectionKey = options.collectionKey || Tokensearch.defaultOptions.collectionKey;
  if (this.collectionKey === '') {
    throw new Error('No collectionKey defined!');
  }
  if (!this.collection || this.collection.length===0) {
    throw new Error('Empty collection!');
  }
  this.searchdataTokenSize = this.collection[0][this.collectionKey].split(this.delimiter).length;
};

Tokensearch.defaultOptions = {
  //split strings with the delimiter
  delimiter: ' ',

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.7,

  // How many search tokens are considered
  maxFilterTokenEntries: 5,

  // search key
  collectionKey: ''
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
  var threshold = customThreshold || this.threshold;

  //make sure the search tokens contains no dups
  var tmp = token.trim().split(this.delimiter).filter(this._onlyUnique);
  for (var i = 0, len = Math.min(tmp.length, this.maxFilterTokenEntries); i < len; i++) {
    searchTokens.push(tmp[i].toLowerCase());
  }
  var normalizedScore = 1 / (searchTokens.length * this.searchdataTokenSize);

  var result = [];
  this.collection.forEach(function(entry) {
    var score = 0;
    entry[self.collectionKey].trim().split(self.delimiter).forEach(function(data) {
      var lcData = data.toLowerCase();
      searchTokens.forEach(function(searchToken) {
        if (lcData.indexOf(searchToken) > -1) {
          score += (lcData === searchToken) ? 2 : 1;
        }
      });
    });
    if (score) {
      var entryScore = 1-normalizedScore*score;
      if (entryScore < 0) {
        entryScore = 0;
      }
      if (entryScore < threshold) {
        result.push({ 'item': entry, 'score': entryScore });
      }
    }
  });

  return result.sort(function(a, b) {
     return a.score - b.score;
  });
};

module.exports = Tokensearch;
