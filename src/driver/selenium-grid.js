'use strict';

module.exports = function(options) {

  return {
    updateCapabilities: function(caps) {
      return caps;
    },
    start: function(callback) {
      console.log('Using the selenium server at ' + options.seleniumUrl);
      callback(null, options.seleniumUrl);
    },
    stop: function(results, callback) {
      callback(null);
    }
  };

};
