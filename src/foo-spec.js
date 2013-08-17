describe('foo', function() {
  it('bar', function() {
    jasmine.getEnv().client.get('http://www.google.de');
    var searchBox = jasmine.getEnv().client.findElement(jasmine.getEnv().webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(value) {
      expect(value).toBe('webdriver');
    });
  }, 10000);
  
  it('baz', function() {
    jasmine.getEnv().client.get('http://www.google.de');
    var searchBox = jasmine.getEnv().client.findElement(jasmine.getEnv().webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    searchBox.getAttribute('value').then(function(value) {
      expect(value).toBe('webdriver');
    });
  }, 10000);
});
