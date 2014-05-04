'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;

describe('selenium-webdriver / mocha / mocha-selenium-webdriver', function() {
  describe('github', function() {
    it('reads the "title"', function() {
      kommando.browser.get('https://www.github.com');
      var heading = kommando.browser.findElement(kommando.webdriver.By.className('heading'));
      expect(heading.getText()).to.eventually.equal('Build software better, together.');
    });
  });
});
