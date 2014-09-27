'use strict';

var lodash = require('lodash');
var promise = require('digdug/node_modules/dojo/Promise');

var merge = lodash.merge;

module.exports = function(tunnelName, DigDugTunnel, options) {

  var jobState = options.jobState;
  delete options.jobState;

  return {
    _tunnel: null,
    updateCapabilities: function(caps) {
      return merge({}, this._tunnel.extraCapabilities, caps);
    },
    start: function(callback) {
      var tunnel = this._tunnel = new DigDugTunnel(merge({
        tunnelId: Date.now()
      }, options));
      tunnel.start().then(function() {
        console.log('Using ' + tunnelName + ' selenium server at: ' + tunnel.clientUrl);
        callback(null, tunnel.clientUrl);
      }, function(error) {
        callback(error);
      });
    },
    stop: function(results, callback) {
      var sendJobStates = [];
      var tunnel = this._tunnel;
      results.forEach(function(result) {
        (result.clientIds || []).forEach(function(clientId) {
          sendJobStates.push(tunnel.sendJobState(clientId, merge({
            success: result.passed
          }, jobState)));
        });
      });
      promise.all(sendJobStates).then(function() {
        return tunnel.stop();
      }).then(callback, callback);
    }
  };

};
