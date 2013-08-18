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
        callback(null, session.getId(), client);
      });
    },
    quitClient: function(client, callback) {
      // TODO: handle errors?
      client.quit().then(function() {
        callback();
      });
    },
    getClients: function() {
      return clients;
    }
  }
}
