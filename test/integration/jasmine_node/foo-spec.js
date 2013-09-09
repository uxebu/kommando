describe('foo', function() {
  var searchBox;
  beforeEach(function() {
    kommando.client.get('http://www.google.de');
    searchBox = kommando.client.findElement(kommando.webdriver.By.name('q'));
  });
  
  it('bar', function() {
    kommando.server.createClient(kommando.capabilities, function(error, id, client, data) {
      searchBox.sendKeys('webdriver');
      expect(searchBox.getAttribute('value')).toBe('webdriver');
    });
  });
});
