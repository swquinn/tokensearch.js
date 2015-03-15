'use strict';

var chai = require('chai');
var expect = chai.expect;
var Tokensearch = require('../lib/tokensearch');
var users = [{
  "name": "DVD 1",
  "manufacturer": "Harman Kardon",
  "type": "DVD"
}, {
  "name": "42PFL9703",
  "manufacturer": "Philips",
  "type": "TV"
}, {
  "name": "KDL-3322",
  "manufacturer": "Sony",
  "type": "AVR"
}, {
  "name": "DVD Gear 1",
  "manufacturer": "Company 1",
  "type": "DVD"
}];

describe('coretest.js -', function() {

  //GIVEN
  var tokenSearch = new Tokensearch(users, { collectionKeys: ['name', 'type', 'manufacturer'] });

  it('exact match', function() {
    //WHEN
    var result = tokenSearch.search('SONY AVR KDL-3322');
    //THEN
    expect(result.length).to.equal(1);
    var e = result[0].item;
    expect(e.name).to.equal('KDL-3322');
    expect(e.manufacturer).to.equal('Sony');
  });

  it('search multiple fiels', function() {
    //WHEN
    var result = tokenSearch.search('Harman DVD 1');
    //THEN
    expect(result.length).to.equal(2);
    var e = result[0].item;
    expect(e.name).to.equal('DVD 1');
    expect(e.manufacturer).to.equal('Harman Kardon');
  });

  it('search one substring', function() {
    //WHEN
    var result = tokenSearch.search('PFL9703');
    //THEN
    expect(result.length).to.equal(1);
    var e = result[0].item;
    expect(e.name).to.equal('42PFL9703');
  });

  it('search one substring', function() {
    //WHEN
    var result = tokenSearch.search('DVD 1');
    //THEN
    expect(result.length).to.equal(2);
  });

});