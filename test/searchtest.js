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
    expect(result.length).to.equal(24);
    expect(result[0].score).to.equal(0);
    expect(result[0].item).to.exist;
    expect(result[0].item.name).to.have.string('GUPTA');
  });

  it('regular search, case insensitive', function() {
    //WHEN
    var result = tokenSearch.search('gupta');

    //THEN
    expect(result.length).to.equal(24);
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
    expect(result[1].item.name).to.have.string('PATEL DHRUVIN UDAYAN');
  });

  it('search unique name, threshold too big', function() {
    //WHEN
    var result = tokenSearch.search('PATE DHRUVI UDAYA', { customThreshold: -0.1 } );

    //THEN
    expect(result.length).to.equal(0);
  });

  it('search entry with a pre search check', function() {
    //WHEN
    var precheck = function(entry) {
      var cmlNumber = parseInt(entry.CML_rank);
      if (cmlNumber < 100) {
        return true;
      }
      return false;
    };
    var result = tokenSearch.search('PATE DHRUVI UDAYA', { preprocessCheck : precheck } );

    //THEN
    expect(result.length).to.equal(6);
    expect(result[0].item.CML_rank.length).to.be.below(3);
    expect(result[1].item.CML_rank.length).to.be.below(3);
    expect(result[2].item.CML_rank.length).to.be.below(3);
    expect(result[3].item.CML_rank.length).to.be.below(3);
    expect(result[4].item.CML_rank.length).to.be.below(3);
    expect(result[5].item.CML_rank.length).to.be.below(3);
  });

});
