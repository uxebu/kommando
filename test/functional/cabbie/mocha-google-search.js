var chai = require('chai');
var expect = chai.expect;

describe('selenium-webdriver / mocha / mocha-selenium-webdriver', function() {
  describe('google-search', function() {
    var browser = kommando.browser;
    
    it('searches for "webdriver"', function() {
      browser.navigateTo('http://www.google.de');
      var searchBox = browser.getElement('[name="q"]');
      searchBox.type('webdriver');
      expect(searchBox.get('value')).to.equal('webdriver');
    });
  });
});
