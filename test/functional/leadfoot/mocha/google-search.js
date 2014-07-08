'use strict';

var chai = require('chai');
var expect = chai.expect;
var leadfootCommand = require('leadfoot/Command');

describe('leadfoot / mocha', function() {
  describe('google-search', function() {
    var command;
    beforeEach(function() {
      command = new leadfootCommand(kommando.browser);
    });

    it('searches for "webdriver"', function() {
      return command.get('http://www.google.de')
        .findByName('q')
          .pressKeys('webdriver')
          .end()
        .findByName('q')
          .getProperty('value')
          .then(function(value) {
            expect(value).to.equal('webdriver');
          })
          .end();
    });
  });
});
