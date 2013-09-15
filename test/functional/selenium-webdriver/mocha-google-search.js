var expect = require('expect.js');

describe('selenium-webdriver / mocha', function() {
  describe('google-search', function() {
    it('searches for "webdriver"', function() {
      kommando.browser.get('http://www.google.de');
      var searchBox = kommando.browser.findElement(kommando.webdriver.By.name('q'));
      searchBox.sendKeys('webdriver');
      searchBox.getAttribute('value').then(function(val) {
        expect(val).to.be('webdriver');
      });
    });
  });
});
