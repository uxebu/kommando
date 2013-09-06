describe('foo', function() {
  var searchBox;
  beforeEach(function() {
    webdriverClient.get('http://www.google.de');
    searchBox = webdriverClient.findElement(webdriver.By.name('q'));
  });
  
  it('bar', function() {
    searchBox.sendKeys('webdriver');
    expect(searchBox.getAttribute('value')).toBe('webdriver');
  });
});
