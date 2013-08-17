describe('foo', function() {
  it('bar', function() {
    client.get('http://www.google.de');
    var searchBox = client.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(value) {
      expect(value).toBe('webdriver');
    });
  }, 10000);
  
  it('baz', function() {
    client.get('http://www.google.de');
    var searchBox = client.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(value) {
      expect(value).toBe('webdriver');
    });
  }, 10000);
});
