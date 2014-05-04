'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

module.exports = function() {

  var browser = kommando.browser;

  this.Given(/^I go to(?: the website)? "([^"]*)"$/, function(url, next) {
    browser.get(url);
    next();
  });

  this.Then(/the headline should equal "([^"]*)"$/, function(text, next) {
    var heading = browser.findElement(kommando.webdriver.By.className('heading'));
    expect(heading.getText()).to.eventually.equal(text).and.notify(next);
  });

};
