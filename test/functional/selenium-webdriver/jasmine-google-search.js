'use strict';

describe('selenium-webdriver / jasmine', function() {
  describe('google-search', function() {
    it('searches for "webdriver"', function(done) {
      kommando.browser.get('http://www.google.de').then(function() {
        return kommando.browser.findElement(kommando.webdriver.By.name('q'));
      }).then(function(searchBox) {
        return searchBox.sendKeys('webdriver').then(function() {
          return searchBox.getAttribute('value');
        });
      }).then(function(attribute) {
        expect(attribute).toBe('webdriver');
      }).then(done, done); // handle promise error / success within "it"
    });
  });
});
