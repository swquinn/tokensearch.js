'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');

describe('./lib/tokensearch.js', function() {
  //GIVEN
  var users;
  var tokenSearch;

  beforeEach(function() {
    users = require('./users.json');
    tokenSearch = new Tokensearch(users, { collectionKey: 'name' });
  });

  it('search john - regular search', function() {
    //WHEN
    var result = tokenSearch.search('JOHN');

    //THEN
    expect(result.length).to.equal(10);
    expect(result[0].score).to.equal(0.5);
    expect(result[0].item).to.exist();
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
    expect(result[0].score).to.equal(0.5);
    expect(result[0].item).to.exist();
    expect(result[0].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

  it.only('search exact match, missing last character', function() {
    //WHEN
    var result = tokenSearch.search('PATE DHRUVI UDAYA');

    //THEN
    expect(result.length).to.equal(1);
    expect(result[0].score).to.equal(0.5);
    expect(result[0].item).to.exist();
    expect(result[0].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

});
