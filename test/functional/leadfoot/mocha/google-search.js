'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('leadfoot / mocha', function() {
  describe('google-search', function() {
    it('searches for "webdriver"', function() {
      return kommando.command.get('http://www.google.de')
        .findByName('q')
        .pressKeys('webdriver')
        .getProperty('value')
        .then(function(value) {
          expect(value).to.equal('webdriver');
        });
    });
  });
});
