var url = require('url');
var wd = require('wd');

module.exports = function(seleniumUrl) {
  var clients = {};
  
  return {
    createClient: function(capabilities, callback) {
      var client = wd.remote(url.parse(seleniumUrl))

      client.init(capabilities, function(error, sessionId) {
        clients[sessionId] = client;
        callback(error, sessionId, client, {});
      });
    },
    quitClient: function(client, callback) {
      delete clients[client.sessionID];
      client.quit(callback);
    },
    getClients: function() {
      return clients;
    }
  }
};
