describe('selenium-webdriver / jasmine', function() {
  describe('google-search', function() {
    it('searches for "webdriver"', function(done) {
      kommando.browser.get('http://www.google.de').then(function() {
        kommando.browser.findElement(kommando.webdriver.By.name('q')).then(function(searchBox) {
          searchBox.sendKeys('webdriver').then(function() {
            searchBox.getAttribute('value').then(function(attribute) {
              expect(attribute).toBe('webdriver');
              done();
            });
          });
        });
      });
    });
  });
});
