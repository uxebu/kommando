describe('foo', function() {
  var searchBox;
  beforeEach(function() {
    kommando.browser.get('http://www.google.de');
    searchBox = kommando.browser.findElement(kommando.webdriver.By.name('q'));
  });
  
  it('bar', function() {
    kommando.createClient(kommando.capabilities, function(error, otherBrowser, data) {
      otherBrowser.get('http://www.google.de').then(function() {
        searchBox.sendKeys('webdriver');
        expect(searchBox.getAttribute('value')).toBe('webdriver');
      });
    });
  });
});
