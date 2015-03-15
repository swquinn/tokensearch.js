'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var users = [{
  "name": "MUTHKHOD SHRIDEVI SHARANGOWDA ",
  "CML_rank": "64400",
  "registrationNumber": "1001061",
  "alloted": null
}, {
  "name": "ADAPPA ASHRAY AMARNATH ",
  "CML_rank": "42680",
  "registrationNumber": "1001091",
  "alloted": "M5207"
}, {
  "name": "IUSE-ANOTHER-DELIM",
  "CML_rank": "42320",
  "registrationNumber": "1001094",
  "alloted": "M5202"
}];

describe('./lib/tokensearch.js - config parameter', function() {

  it('default parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKey: 'name' });
    //WHEN
    var result = tokenSearch.search('ADAPPA ASHRAY');
    //THEN
    expect(result.length).to.equal(1);
  });

  it('threshold parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKey: 'name', threshold: 0.1 });
    //WHEN
    var result = tokenSearch.search('ADAPPA ASHRAY');
    //THEN
    expect(result.length).to.equal(0);
  });

  it('delimiter parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKey: 'name', delimiter: '-' });
    //WHEN
    var result = tokenSearch.search('IUS-ANOTHE-DELI');
    //THEN
    expect(result.length).to.equal(1);
  });

  it('maxFilterTokenEntries parameter', function() {
    //GIVEN
    var tokenSearch = new Tokensearch(users, { collectionKey: 'name', maxFilterTokenEntries: '1' });
    //WHEN
    var result = tokenSearch.search('XXX ADAPPA ASHRAY AMARNATH');
    //THEN
    expect(result.length).to.equal(0);
  });

});