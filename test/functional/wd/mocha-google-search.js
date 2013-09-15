var expect = require('expect.js');

describe('wd / mocha', function() {
  describe('google-search', function() {
    var browser = kommando.browser;
    var searchBox;
    before(function(done) {
      browser.get('http://www.google.de', function() {
        browser.elementByName('q', function(error, element) {
          searchBox = element;
          done();
        });
      });
    });
  
    it('searches for "webdriver"', function(done) {
      searchBox.sendKeys('webdriver', function(error) {
        searchBox.getAttribute('value', function(error, value) {
          expect(value).to.be('webdriver');
          done();
        });
      });
    });
  });
});
