'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('wd with promise / mocha', function() {
  describe('google-search', function() {
    var browser = kommando.browser;

    it('searches for "webdriver"', function(done) {
      browser.get('http://www.google.de').then(function() {
        return browser.elementByName('q');
      }).then(function(searchBox) {
        // creating own deferred because searchBox.sendKeys
        // does not return a promise
        var deferred = kommando.wd.Q.defer();
        searchBox.sendKeys('webdriver', function(error) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve(searchBox);
          }
        });
        return deferred.promise;
      }).then(function(searchBox) {
        return searchBox.getAttribute('value');
      }).then(function(value) {
        expect(value).to.equal('webdriver');
      }).then(done, done); // handle promise error / success within "it"
    });
  });
});
