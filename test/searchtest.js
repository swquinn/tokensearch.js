'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var users = require('./users.json');

describe('searchtest.js -', function() {
  //GIVEN
  var tokenSearch;

  beforeEach(function() {
    tokenSearch = new Tokensearch(users, { collectionKeys: ['name'] });
  });

  it('regular search', function() {
    //WHEN
    var result = tokenSearch.search('GUPTA');

    //THEN
    expect(result.length).to.equal(25);
    expect(result[0].score).to.equal(0);
    expect(result[0].item).to.exist();
    expect(result[0].item.name).to.have.string('GUPTA');
  });

  it('regular search, case insensitive', function() {
    //WHEN
    var result = tokenSearch.search('gupta');

    //THEN
    expect(result.length).to.equal(25);
    expect(result[0].item.name).to.have.string('GUPTA');
  });

  it('search non existing user', function() {
    //WHEN
    var result = tokenSearch.search('MICHAEL VOGT');

    //THEN
    expect(result.length).to.equal(0);
  });

  it('search exact match', function() {
    //WHEN
    var result = tokenSearch.search('PATEL DHRUVIN UDAYAN');

    //THEN
    expect(result.length).to.equal(29);
    expect(result[0].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

  it('search unique name, missing last character', function() {
    //WHEN
    var result = tokenSearch.search('PATE DHRUVI UDAYA');

    //THEN
    expect(result.length).to.equal(31);
    expect(result[0].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

  it('search unique name, threshold too big', function() {
    //WHEN
    var result = tokenSearch.search('PATE DHRUVI UDAYA', -0.1);

    //THEN
    expect(result.length).to.equal(0);
  });

});


describe('README.md', function() {
  it('example should work', function() {
    //GIVEN
    var readmeUser = [{
      "name": "JOHN PETER DOW",
      "id": "123"
    }, {
      "name": "FOO BAR JOHN",
      "id": "127",
    }, {
      "name": "BODE JON MULLER",
      "id": "147",
    }];
    var tokenSearch = new Tokensearch(readmeUser, { collectionKeys: ['name'] });

    //WHEN
    var result = tokenSearch.search('JOHN BAR');

    //THEN
    //console.log(JSON.stringify(result));
    expect(result.length).to.equal(2);
  });
});
