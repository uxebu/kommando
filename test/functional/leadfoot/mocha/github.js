'use strict';

var chai = require('chai');
var expect = chai.expect;
var leadfootCommand = require('leadfoot/Command');

describe('leadfoot / mocha', function() {
  describe('github', function() {
    var command;
    beforeEach(function() {
      command = new leadfootCommand(kommando.browser);
    });

    it('reads the "title"', function() {
      return command.get('https://www.github.com')
        .findByClassName('heading')
        .getVisibleText()
        .then(function(text) {
          expect(text).to.equal('Build software better, together.');
        });
    });
  });
});
