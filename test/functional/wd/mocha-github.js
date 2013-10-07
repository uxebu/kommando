var expect = require('expect.js');

describe('wd / mocha', function() {

  describe('github', function() {
    var browser = kommando.browser;

    it('reads the "title"', function(done) {
      browser.get('https://www.github.com', function() {
        browser.elementByClassName('heading', function(error, element) {
          if (error) {
            done(error);
            return;
          }
          element.text(function(error, value) {
            expect(value).to.be('Build software better, together.');
            done(error);
          });
        });
      });
    });
  });

});
