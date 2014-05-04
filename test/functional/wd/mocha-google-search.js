'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('wd / mocha', function() {
  describe('google-search', function() {
    var browser = kommando.browser;
    var searchBox;
    beforeEach(function(done) {
      browser.get('http://www.google.de', function() {
        browser.elementByName('q', function(error, element) {
          searchBox = element;
          done(error);
        });
      });
    });

    it('searches for "webdriver"', function(done) {
      searchBox.sendKeys('webdriver', function(error) {
        if (error) {
          done(error);
          return;
        }
        searchBox.getAttribute('value', function(error, value) {
          expect(value).to.equal('webdriver');
          done(error);
        });
      });
    });
  });
});
