var async = require('async');
var url = require('url');
var wd = require('wd');

module.exports = function(seleniumUrl) {
  return {
    clients: {},
    create: function(capabilities, callback) {
      var client = wd.promiseRemote(url.parse(seleniumUrl));

      client.init(capabilities, function(error, sessionId) {
        this.clients[sessionId] = client;
        callback(error, client, {});
      }.bind(this));
    },
    end: function(callback) {
      var client;
      var quitFunctions = [];

      for (var id in this.clients) {
        client = this.clients[id];
        delete this.clients[id];
        quitFunctions.push(client.quit.bind(client));
      }
      async.series(quitFunctions, callback);
    }
  };
};
