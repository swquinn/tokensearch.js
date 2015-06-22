'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var collection = [{
  "name": "BART"
}, {
  "name": "LISA"
}, {
  "name": "HOMER"
}, {
  "name": "GRANDPA"
}];

describe('searchalgorithmtest.js', function() {

  it('custom search HOMER', function() {
    //GIVEN
    var stupidSearch = function(haystack) {
      var stringPos = haystack.indexOf('homer');
      if (stringPos > -1) {
        return 100;
      }
      return 0;
    };

    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'], searchAlgorithm: stupidSearch });
    //WHEN
    var result = tokenSearch.search('');
    //THEN
    expect(result[0].item.name).to.equal('HOMER');
    expect(result[0].score).to.equal(0);
  });

  it('custom search LISA', function() {
    //GIVEN
    var stupidSearch = function(haystack, needle) {
      var stringPos = haystack.indexOf(needle);
      if (stringPos > -1) {
        return 100;
      }
      return 0;
    };

    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'], searchAlgorithm: stupidSearch });
    //WHEN
    var result = tokenSearch.search('lisa');
    //THEN
    expect(result[0].item.name).to.equal('LISA');
    expect(result[0].score).to.equal(0);
  });

  it('search results are sorted', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'] });
    //WHEN
    var result = tokenSearch.search('a');
    //THEN
    expect(result[0].item.name).to.equal('BART');
    expect(result[1].item.name).to.equal('GRANDPA');
    expect(result[2].item.name).to.equal('LISA');
  });

});