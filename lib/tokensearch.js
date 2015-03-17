(function(global) {
'use strict';
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
  this.searchAlgorithm = options.searchAlgorithm || Tokensearch.defaultOptions.searchAlgorithm;
  this.sortAlgorithm = options.sortAlgorithm || Tokensearch.defaultOptions.sortAlgorithm;
  this.postprocessAlgorithm = options.postprocessAlgorithm || Tokensearch.defaultOptions.postprocessAlgorithm;
  if (this.collectionKeys.length===0) {
    throw new Error('No collectionKeys defined!');
  }
  this.collectionDataTokenSize = this.collectionKeys.length;
  this._prepareSearchTokens();
};

Tokensearch.defaultOptions = {
  //split strings with a delimiters, can be a regex or a character
  delimiter: /[\s-_]+/,

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.7,

  // How many search tokens are considered
  maxFilterTokenEntries: 5,

  // search key
  collectionKeys: [],
  
  // search all 'needles' in the 'haystack', return a score for each function call
  searchAlgorithm: function(haystack, needles) {    
    var arrayLength = needles.length;
    for (var i = 0; i < arrayLength; i++) {
      var needle = needles[i];
      var stringPos = haystack.indexOf(needle);
      if (stringPos > -1) {
        if (haystack === needle) {
          return 6;
        }
        if (stringPos === 0) {
          return 2;
        }
        return 1;        
      }
    }
    return 0;
  },
  
  //postprocess all elements
  postprocessAlgorithm: function(collection, maxScore, threshold) {    
    var normalizedScore = 1 / maxScore;
    var result = [];
    collection.forEach(function(e) {
      e.score = 1-e.score*normalizedScore;
      if (e.score <= threshold) {
        result.push(e);
      }
    });
    return result;	
  },
  
  // sort the result array
  sortAlgorithm: function(array) {
    return array.sort(function(a, b) {
	  return a.score - b.score;
    });  
  }
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
  var self = this;
  
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
	  score += self.searchAlgorithm(dataEntryToken, searchTokens);
    });
    if (score) {
      if (score > maxScore) {
        maxScore = score;
      }
      resultTmp.push({ 'item': entry.item, 'score': score });
    }
  });

  //postprocess
  var result = self.postprocessAlgorithm(resultTmp, maxScore, threshold);
  
  //sort
  return self.sortAlgorithm(result);
};

  // Export to Common JS Loader
  if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Tokensearch;
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      return Tokensearch;
    });
  } else {
    // Browser globals (root is window)
    global.Tokensearch = Tokensearch;
  }

})(this);
