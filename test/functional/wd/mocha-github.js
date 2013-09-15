var expect = require('expect.js');

describe('wd / mocha', function() {
  describe('github', function() {
    var browser = kommando.browser;
    var heading;
    before(function(done) {
      browser.get('https://www.github.com', function() {
        browser.elementByClassName('heading', function(error, element) {
          heading = element;
          done();
        });
      });
    });
  
    it('reads the "title"', function(done) {
      heading.text(function(error, value) {
        expect(value).to.be('Build software better, together.');
        done();
      });
    });
  });
});
