describe('bar', function() {
  it('foo', function() {
    webdriverClient.get('http://www.google.de');
    var searchBox = webdriverClient.findElement(webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    expect(searchBox.getAttribute('value')).toBe('webdriver');
  });
});
