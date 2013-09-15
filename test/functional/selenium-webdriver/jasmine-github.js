describe('selenium-webdriver / jasmine', function() {
  describe('github', function() {
    it('reads the "title"', function() {
      kommando.browser.get('https://www.github.com');
      var heading = kommando.browser.findElement(kommando.webdriver.By.className('heading'));
      expect(heading.getText()).toBe('Build software better, together.');
    });
  });
});
