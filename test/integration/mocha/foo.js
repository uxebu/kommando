var expect = require('expect.js');

describe('foo', function() {
  var searchBox;
  before(function() {
    kommando.client.get('http://www.google.de');
    searchBox = kommando.client.findElement(kommando.webdriver.By.name('q'));
  });
  
  it('bar', function() {
   searchBox.sendKeys('webdriver');
   searchBox.getAttribute('value').then(function(val) {
     expect(val).to.be('webdriver');
    });
  });
});
