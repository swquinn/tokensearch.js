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

describe('postprocess algorithm -', function() {

  it('custom search HOMER', function() {
    //GIVEN
    var postprocessAlgorithm = function(collection, maxScore, threshold) {
      var result = [];
      collection.forEach(function(e) {
        var stringPos = e.item.name.indexOf('HOMER');
        if (stringPos > -1) {
          result.push(e);
        }
      });
      return result;
    };

    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'], postprocessAlgorithm: postprocessAlgorithm });
    //WHEN
    var result = tokenSearch.search('BART LISA HOMER GRANDPA');
    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.equal('HOMER');
  });


});