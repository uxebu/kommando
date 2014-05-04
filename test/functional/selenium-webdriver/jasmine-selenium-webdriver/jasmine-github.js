'use strict';

describe('selenium-webdriver / jasmine / jasmine-selenium-webdriver', function() {
  describe('github', function() {
    it('reads the "title"', function() {
      kommando.browser.get('https://www.github.com');
      var heading = kommando.browser.findElement(kommando.webdriver.By.className('heading'));
      expect(heading.getText()).toBe('Build software better, together.');
    });
  });
});
