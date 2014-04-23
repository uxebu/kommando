var chai = require('chai');
var expect = chai.expect;

describe('webdriver-http-sync / mocha', function() {
  describe('github', function() {
    var browser = kommando.browser;

    it('reads the "title"', function() {
      browser.navigateTo('https://www.github.com');
      expect(browser.getElement('.heading').text()).to.equal('Build software better, together.');
    });
  });
});
