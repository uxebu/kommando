var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');
var webdriverSetup = require('webdriver');
var relay = require('relay');

// Default configuration.
/*var config = {
  sauceUser: '',
  sauceKey: '',
  sauceTunneled: '',

  seleniumArgs: [],

  seleniumAddress: null,

  capabilities: {
    'browserName': 'chrome'
  },
  baseUrl: '',
  specs: [] // glob
}*/

var runnerCount = 0;
var seleniumServer;

var executeSpecs = function(error, config) {
  if (error) {
    throw error;
  }
  var server = config.server = require('./client/selenium_webdriver.js')(config.seleniumAddress);
  var runner = require('./runner/jasmine_node.js');

  var capabilities = config.capabilities;
  var runnerSetupFunctions = [];
  var runnerSetupArgs = [];
  for (var i = 0, l = capabilities.length; i < l; i++) {
    runnerSetupFunctions.push(setupRunner);
    runnerSetupArgs.push([
      config,
      capabilities[i],
      runner
    ]);
  }
  runnerSetupArgs.push(function(error) {
    runner.run(function(error, passed) {
      var clients = server.getClients();
      var clientQuitFunctions = [];
      var clientQuitArgs = [];
      for (var key in clients) {
        clientQuitFunctions.push(server.quitClient);
        clientQuitArgs.push([clients[key]]);
      }
      clientQuitArgs.push(cleanupServer);
      var quitClients = relay.parallel.apply(server, clientQuitFunctions);
      quitClients.apply(null, clientQuitArgs);
    });
  });
  var runnerSetup = relay.parallel.apply(null, runnerSetupFunctions);
  runnerSetup.apply(null, runnerSetupArgs);
};

var setupRunner = function(config, capabilities, runner, callback) {
  config.server.createClient(capabilities, function(error, id, client) {
    if (error) {
      callback(error);
    } else {
      runner.setup({
        client: client,
        server: config.server,
        capabilities: capabilities,
        runnerArgs: {
          specs: config.specs
        }
      });
      callback(null);
    }
  });
};

var cleanupServer = function(error, passed) {
  if (sauceAccount) {
    sauceAccount.updateJob(id, {passed: passed}, function() {});
  }

  if (runnerCount === 0) {
    if (seleniumServer) {
      console.log('Shutting down selenium standalone server');
      seleniumServer.stop();
    }
    process.exit(passed ? 0 : 1);
  };
};

var run = function(config) {
  if (config.sauceUser && config.sauceKey) {
    console.log('Using SauceLabs selenium server at ' + config.seleniumAddress);
    runWithSauceLabs(config, executeSpecs);
  } else if (config.seleniumAddress) {
    console.log('Using the selenium server at ' + config.seleniumAddress);
    runWithSeleniumAddress(config, executeSpecs);
  } else {
    console.log('Starting selenium standalone server...');
    runWithSeleniumServer(config, executeSpecs);
  }
};

var runWithSauceLabs = function(config, callback) {
  config.capabilities.username = config.sauceUser;
  config.capabilities.accessKey = config.sauceKey;
  config.seleniumAddress = [
    'http://',
    config.sauceUser,
    ':',
    config.sauceKey,
    '@ondemand.saucelabs.com:80/wd/hub'
  ].join('');
  callback(null, config);
};

var runWithSeleniumAddress = function(config, callback) {
  callback(null, config);
};

var runWithSeleniumServer = function(config, callback) {
  config.seleniumArgs = config.seleniumArgs || [];
  seleniumServer = new remote.SeleniumServer(webdriverSetup.selenium.path, {
    args: webdriverSetup.args.concat(config.seleniumArgs)
  });
  seleniumServer.start().then(function(url) {
    console.log('Selenium standalone server started at ' + url);
    config.seleniumAddress = url;
    callback(null, config);
  });
};

var config = {};

var sauceAccount;
if (config.sauceUser && config.sauceKey) {
  sauceAccount = new SauceLabs({
    username: config.sauceUser,
    password: config.sauceKey
  });
}

module.exports = run;
