var webdriver = require('selenium-webdriver');

module.exports = function(seleniumAddress) {
  var clients = {};
  
  return {
    createClient: function(capabilities, callback) {
      var client = new webdriver.Builder()
        .usingServer(seleniumAddress)
        .withCapabilities(capabilities)
        .build();

      client.manage().timeouts().setScriptTimeout(100000);
      // TODO: handle errors?
      client.getSession().then(function(session) {
        clients[session.getId()] = client;
        callback(null, session.getId(), client, {
          webdriver: webdriver
        });
      });
    },
    quitClient: function(client, callback) {
      // TODO: handle errors?
      client.getSession().then(function(session) {
        var sessionId = session.getId();
        client.quit().then(function() {
          delete clients[sessionId];
          callback();
        });
      });
    },
    getClients: function() {
      return clients;
    }
  }
}
