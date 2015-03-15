'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var users = require('./users.json');

describe('./lib/tokensearch.js - search example', function() {
  //GIVEN
  var tokenSearch;

  beforeEach(function() {
    tokenSearch = new Tokensearch(users, { collectionKey: 'name' });
  });

  it('regular search', function() {
    //WHEN
    var result = tokenSearch.search('JOHN');

    //THEN
    expect(result.length).to.equal(10);
    expect(result[0].score).to.equal(0.5);
    expect(result[0].item).to.exist();
    expect(result[0].item.name).to.have.string('JOHN');
  });

  it('regular search, case insensitive', function() {
    //WHEN
    var result = tokenSearch.search('john');

    //THEN
    expect(result.length).to.equal(10);
    expect(result[0].item.name).to.have.string('JOHN');
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
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

  it('search unique name, missing last character', function() {
    //WHEN
    var result = tokenSearch.search('PATE DHRUVI UDAYA', 0.8);

    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

  it('search unique name, threshold too big', function() {
    //WHEN
    var result = tokenSearch.search('PATE DHRUVI UDAYA');

    //THEN
    expect(result.length).to.equal(0);
  });

});
