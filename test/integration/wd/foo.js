var expect = require('expect.js');

describe('foo', function() {
  var browser = kommando.client;
  var searchBox;
  before(function(done) {
    browser.get('http://www.google.de', function() {
      browser.elementByName('q', function(error, element) {
        searchBox = element;
        done();
      });
    });
  });
  
  it('bar', function(done) {
    searchBox.sendKeys('webdriver', function(error) {
      searchBox.getAttribute('value', function(error, value) {
        expect(value).to.be('webdriver');
        done();
      });
    });
  });
});
