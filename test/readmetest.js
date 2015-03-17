'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');

describe('README.md', function() {

  it('simple example should work', function() {
    //GIVEN
    var collection = [{
      "name": "JOHN PETER DOW",
      "id": "123"
    }, {
      "name": "FOO BAR JOHN",
      "id": "127",
    }, {
      "name": "BODE JON MULLER",
      "id": "147",
    }];
    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'] });

    //WHEN
    var result = tokenSearch.search('JOHN BAR');

    //THEN
    //console.log(JSON.stringify(result));
    expect(result.length).to.equal(2);
  });

  it('advanced 1 example should work', function() {
    //GIVEN
    var collection = [{
      "name": "JOHN PETER DOW",
      "address": "a:funny:street:44",
      "id": "123"
    }, {
      "name": "FOO BAR JON",
      "address": "bullvd:33",
      "id": "127",
    }, {
      "name": "BODE JOHN MULLER",
      "address": "upside:street",
      "id": "147",
    }];
    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name', 'address'], delimiter: /[\s:]+/, threshold: 0.5});

    //WHEN
    var result = tokenSearch.search('JOHN:street');

    //THEN
    expect(result.length).to.equal(2);
    expect(result[0].item.name).to.equal('JOHN PETER DOW');
    expect(result[1].item.name).to.equal('BODE JOHN MULLER');
  });

  it('advanced 2 example should work', function() {
    //GIVEN
    var collection = [{
      "name": "JOHN DOE",
      "address": "a:funny:street:44",
      "id": "123"
    }, {
      "name": "FOO BAR JON",
      "address": "bullvd:33",
      "id": "127",
    }, {
      "name": "BODE MULLER",
      "address": "john:upside:street",
      "id": "147",
    }];

    var tokenSearch = function(haystack, needles) {
      var score = 0;
      var arrayLength = needles.length;
      for (var i = 0; i < arrayLength; i++) {
        var needle = needles[i];
        if (haystack === needle) {
          score ++;
        }
      }
      return score;
    };
    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name', 'address'], delimiter: /[\s:]+/, threshold: 0.5, searchAlgorithm: tokenSearch});

    //WHEN
    var result = tokenSearch.search('JOHN');

    //THEN
    expect(result.length).to.equal(2);
    expect(result[0].item.name).to.equal('JOHN DOE');
    expect(result[0].score).to.equal(0);
    expect(result[1].item.name).to.equal('BODE MULLER');
    expect(result[1].score).to.equal(0);
  });

});
