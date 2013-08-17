var webdriver = require('selenium-webdriver');

module.exports = function(seleniumAddress) {
  return {
    createClient: function(capabilities, callback) {
      var client = new webdriver.Builder()
        .usingServer(seleniumAddress)
        .withCapabilities(capabilities)
        .build();

      client.manage().timeouts().setScriptTimeout(100000);
      // TODO: handle errors?
      client.getSession().then(function(session) {
        callback(null, session.getId(), client);
      });
    },
    quitClient: function(client, callback) {
      // TODO: handle errors?
      try {
      client.quit().then(function() {
        callback();
      });
    } catch(e) {
      callback();
    }
    }
  }
}
