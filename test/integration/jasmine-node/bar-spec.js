describe('bar', function() {
  it('foo', function() {
    kommando.browser.get('http://www.google.de');
    var searchBox = kommando.browser.findElement(kommando.webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    expect(searchBox.getAttribute('value')).toBe('webdriver');
  });
});
