var cabbie = require('cabbie');

module.exports = function(seleniumUrl) {
  return {
    clients: {},
    create: function(capabilities, callback) {
      try {
        var client = new cabbie(seleniumUrl, capabilities, {mode: 'sync'});
        this.clients[client.getSessionID()] = client;
        callback(null, client, {});
      } catch(error) {
        callback(error);
      }
    },
    end: function(callback) {
      var client;
      
      try {
        for (var id in this.clients) {
          client = this.clients[id];
          delete this.clients[id];
          client.dispose();
        }
        callback();
      } catch(error) {
        callback(error);
      }
    }
  };
};
