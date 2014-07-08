'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('leadfoot / mocha', function() {
  describe('github', function() {
    it('reads the "title"', function() {
      return kommando.command.get('https://www.github.com')
        .findByClassName('heading')
        .getVisibleText()
        .then(function(text) {
          expect(text).to.equal('Build software better, together.');
        });
    });
  });
});
