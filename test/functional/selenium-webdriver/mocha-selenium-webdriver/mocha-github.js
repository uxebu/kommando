var expect = require('expect.js');

describe('selenium-webdriver / mocha / mocha-selenium-webdriver', function() {
  describe('github', function() {
    it('reads the "title"', function() {
      kommando.browser.get('https://www.github.com');
      var heading = kommando.browser.findElement(kommando.webdriver.By.className('heading'));
      heading.getText().then(function(val) {
        expect(val).to.be('Build software better, together.');
      });
    });
  });
});
