describe('foo', function() {
  var searchBox;
  beforeEach(function() {
    kommando.browser.get('http://www.google.de');
    searchBox = kommando.browser.findElement(kommando.webdriver.By.name('q'));
  });
  
  it('bar', function() {
    kommando.client.createClient(kommando.capabilities, function(error, id, otherBrowser, data) {
      searchBox.sendKeys('webdriver');
      expect(searchBox.getAttribute('value')).toBe('webdriver');
    });
  });
});
