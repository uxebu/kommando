var expect = require('expect.js');
var test = require('selenium-webdriver/testing');

describe('bar', function() {
  it('foo', function() {
    kommando.client.get('http://www.google.de');
    var searchBox = kommando.client.findElement(kommando.webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(val) {
      expect(val).to.be('webdriver');
    });
  });
});
