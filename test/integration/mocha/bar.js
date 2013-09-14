var expect = require('expect.js');
var test = require('selenium-webdriver/testing');

describe('bar', function() {
  it('foo', function() {
    kommando.browser.get('http://www.google.de');
    var searchBox = kommando.browser.findElement(kommando.webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(val) {
      expect(val).to.be('webdriver');
    });
  });
});
