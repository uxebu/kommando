describe('bar', function() {
  it('foo', function() {
    kommando.client.get('http://www.google.de');
    var searchBox = kommando.client.findElement(kommando.webdriver.By.name('q'));
    searchBox.sendKeys('webdriver');
    expect(searchBox.getAttribute('value')).toBe('webdriver');
  });
});
