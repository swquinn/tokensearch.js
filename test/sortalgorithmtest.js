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

describe('sortalgorithmtest.js', function() {

  it('custom search HOMER', function() {
    //GIVEN
    var stringSort = function(array) {
      return array.sort(function(a, b) {
        return a.item.name.localeCompare(b.item.name);
      });
    };

    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'], sortAlgorithm: stringSort });
    //WHEN
    var result = tokenSearch.search('BART LISA HOMER GRANDPA');
    //THEN
    expect(result.length).to.equal(4);
    expect(result[0].item.name).to.equal('BART');
    expect(result[1].item.name).to.equal('GRANDPA');
    expect(result[2].item.name).to.equal('HOMER');
    expect(result[3].item.name).to.equal('LISA');
  });


});