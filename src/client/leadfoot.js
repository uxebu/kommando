'use strict';

var Promise = require('leadfoot/node_modules/dojo/Promise');
var leadfootServer = require('leadfoot/Server');

module.exports = function(seleniumUrl) {
  return {
    server: null,
    clients: {},
    create: function(capabilities, callback) {
      var server = this.server = new leadfootServer(seleniumUrl);
      server.createSession(capabilities).then(function(client) {
        this.clients[client.sessionId] = client;
        callback(null, client, {});
      }.bind(this), callback);
    },
    end: function(callback) {
      var server = this.server;
      var allDeleteSession = [];
      for (var id in this.clients) {
        allDeleteSession.push(server.deleteSession(id));
        delete this.clients[id];
      }
      Promise.all(allDeleteSession).then(callback);
    }
  };
};
