'use strict';

var url = require('url');

var lodash = require('lodash');
var Promise = require('digdug/node_modules/dojo/Promise');
var DigdugSauceLabsTunnel = require('digdug/SauceLabsTunnel');

module.exports = function(options) {

  return {
    _tunnel: null,
    updateCapabilities: function(caps) {
      return lodash.merge({
        name: options.sauceName,
        build: options.sauceBuild,
        tags: options.sauceTags
      }, this._tunnel.extraCapabilities, caps);
    },
    start: function(callback) {
      var tunnel = this._tunnel = new DigdugSauceLabsTunnel({
        accessKey: options.sauceKey,
        username: options.sauceUser,
        tunnelId: +new Date()
      });
      tunnel.start().then(function(error) {
        console.log('Using SauceLabs selenium server at: ' + tunnel.clientUrl);
        callback(null, tunnel.clientUrl);
      }, function(error) {
        callback(error);
      });
    },
    stop: function(results, callback) {
      var sendJobStates = [];
      var tunnel = this._tunnel;
      results.forEach(function(result) {
        result.clientIds.forEach(function(clientId) {
          sendJobStates.push(tunnel.sendJobState(clientId, {passed: result.passed}));
        });
      });
      Promise.all(sendJobStates).then(function() {
        return tunnel.stop();
      }).then(callback, callback);
    }
  };

};
