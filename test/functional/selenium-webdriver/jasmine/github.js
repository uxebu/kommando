'use strict';

describe('selenium-webdriver / jasmine', function() {
  describe('github', function() {
    it('reads the "title"', function(done) {
      kommando.browser.get('https://www.github.com').then(function() {
        return kommando.browser.findElement(kommando.webdriver.By.className('heading'));
      }).then(function(heading) {
        return heading.getText();
      }).then(function(text) {
        expect(text).toBe('Build software better, together.');
      }).then(done, done); // handle promise error / success within "it"
    });
  });
});
