'use strict';

describe('selenium-webdriver / jasmine / jasmine-selenium-webdriver', function() {
  describe('google-search', function() {
    it('searches for "webdriver"', function() {
      kommando.browser.get('http://www.google.de');
      var searchBox = kommando.browser.findElement(kommando.webdriver.By.name('q'));
      searchBox.sendKeys('webdriver');
      expect(searchBox.getAttribute('value')).toBe('webdriver');
    });
  });
});
