describe('selenium-webdriver / jasmine', function() {
  describe('github', function() {
    it('reads the "title"', function(done) {
      kommando.browser.get('https://www.github.com').then(function() {
        kommando.browser.findElement(kommando.webdriver.By.className('heading')).then(function(heading) {
          heading.getText().then(function(text) {
            expect(text).toBe('Build software better, together.');
            done();
          });
        });
      });
    });
  });
});
