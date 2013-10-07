require("mocha-as-promised")();
var expect = require('expect.js');

describe('wd with promise / mocha', function() {
  describe('github', function() {
    var browser = kommando.browser;

    it('reads the "title"', function(done) {
      browser.get('https://www.github.com').then(function() {
        return browser.elementByClassName('heading');
      }).then(function(heading) {
        return heading.text();
      }).then(function(value) {
        expect(value).to.be('Build software better, together.');
      }).then(done, done); // handle promise error / success within "it"
    });
  });
});
