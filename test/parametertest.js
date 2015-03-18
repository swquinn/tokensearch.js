'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var users = [{
  "name": "MUTHKHOD SHRIDEVI SHARANGOWDA "
}, {
  "name": "ADAPPB PILLE PALLE "
}, {
  "name": "ADAPPA ASHRAY AMARNATH "
}, {
  "name": "IUSE:ANOTHER:DELIM"
}];

describe('parametertest.js', function() {

  it('default parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKeys: ['name'] });
    //WHEN
    var result = tokenSearch.search('ADAPPA');
    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.equal('ADAPPA ASHRAY AMARNATH ');
    expect(result[0].score).to.equal(0);
  });

  it('threshold parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKeys: ['name'], threshold: 0.1 });
    //WHEN
    var result = tokenSearch.search('ADAPP ASHRAY');

    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.equal('ADAPPA ASHRAY AMARNATH ');
    expect(result[0].score).to.equal(0);
  });

  it('delimiter parameter, character', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKeys: ['name'], delimiter: ':' });
    //WHEN
    var result = tokenSearch.search('IUS:DELI');
    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.equal('IUSE:ANOTHER:DELIM');
    expect(result[0].score).to.equal(0);
  });

  it('delimiter parameter, regex', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKeys: ['name'], delimiter: /[:]+/ });
    //WHEN
    var result = tokenSearch.search('IUS:ANOTHE:DELI');
    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.equal('IUSE:ANOTHER:DELIM');
    expect(result[0].score).to.equal(0);
  });

  it('maxFilterTokenEntries parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKeys: ['name'], maxFilterTokenEntries: '1' });
    //WHEN
    var result = tokenSearch.search('XXX ADAPPA ASHRAY AMARNATH');
    //THEN
    expect(result.length).to.equal(0);
  });

});