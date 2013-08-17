var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');
var webdriverSetup = require('webdriver');

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
  var runnerArgs = {
    specFolders: config.specFolders
  };
  var server = require('./client/selenium_webdriver.js')(config.seleniumAddress);
  
  _executeSpecsWithCapabilities(server, config.capabilities, runnerArgs);
};

var _executeSpecsWithCapabilities = function(server, capabilities, runnerArgs) {
  var capability = capabilities.splice(0, 1)[0];
  console.log('Execute specs with ' + capability.browserName);
  executeSpecsWithCapabilities(server, capability, runnerArgs, function(error, passed) {
    if (capabilities.length === 0) {
      cleanupServer(error, passed);
    } else {
      _executeSpecsWithCapabilities(server, capabilities, runnerArgs);
    }
  });
};

var executeSpecsWithCapabilities = function(server, capabilities, runnerArgs, callback) {
  server.createClient(capabilities, function(error, id, client) {
    var cleanup = function(error, passed, client) {
      if (error) {
        callback(error);
        return;
      }
      server.quitClient(client, function() {
        callback(error, passed);
      });
    };

    var runner = require('./runner/jasmine_node.js');
    runner({
      client: client,
      server: server,
      capabilities: capabilities,
      runnerCallback: cleanup,
      runnerArgs: runnerArgs
    });
  });
}

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

/*run({
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: webdriver.Capabilities.phantomjs(),
  specFolders: ['./src']
});
*/
run({
  capabilities: [
    {browserName: 'phantomjs'},
    {browserName: 'chrome'},
    {browserName: 'firefox'},
    {browserName: 'safari'}
  ],
  specFolders: ['./src']
});
