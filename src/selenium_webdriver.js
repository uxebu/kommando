var webdriver = require('selenium-webdriver');

module.exports.create = function(seleniumAddress, seleniumCapabilities, callback) {
  var client = new webdriver.Builder()
    .usingServer(seleniumAddress)
    .withCapabilities(seleniumCapabilities)
    .build();

  client.manage().timeouts().setScriptTimeout(100000);
  // TODO: handle errors?
  client.getSession().then(function(session) {
    callback(null, session.id, client);
  });
};

module.exports.quit = function(client, callback) {
  // TODO: handle errors?
  client.quit().then(function() {
    callback();
  });
};
