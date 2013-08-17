describe('foo', function() {
  it('bar', function() {
    if (typeof counter !== 'undefined') {
      console.log(counter);
    }
    
    client.get('http://www.google.de');
    var searchBox = client.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(value) {
      expect(value).toBe('webdriver');
    });
  }, 10000);
});
