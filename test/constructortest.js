'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var users = [{
  "name": "IUSE-ANOTHER-DELIM",
  "CML_rank": "42320",
  "registrationNumber": "1001094",
  "alloted": "M5202"
}];

describe('constructortest.js', function() {

  it('invalid constructor, no collectionKey', function() {
    //GIVEN
    var failed = false;
    try {
      //WHEN
      tokenSearch = new Tokensearch();
    } catch (ex) {
      failed = true;
    }
    //THEN
    expect(failed).to.be.true;
  });

  it('invalid constructor, null collectionKey', function() {
    //GIVEN
    var failed = false;
    try {
      //WHEN
      tokenSearch = new Tokensearch(users, { collectionKeys: null });
    } catch (ex) {
      failed = true;
    }
    //THEN
    expect(failed).to.be.true;
  });

  it('invalid constructor, null collection', function() {
    //GIVEN
    var failed = false;
    try {
      //WHEN
      tokenSearch = new Tokensearch(null, { collectionKeys: ['name'] });
    } catch (ex) {
      failed = true;
    }
    //THEN
    expect(failed).to.be.true;
  });

  it('invalid constructor, empty collection', function() {
    //GIVEN
    var failed = false;
    try {
      //WHEN
      tokenSearch = new Tokensearch([], { collectionKeys: ['name'] });
    } catch (ex) {
      failed = true;
    }
    //THEN
    expect(failed).to.be.true;
  });

});