var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');
var webdriverSetup = require('webdriver-setup')(process);

var jasmineNodeRunner = require('./jasmine_node/runner.js');

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

var driver;

var executeSpecs = function(error, config) {
  if (error) {
    throw error;
  }
  
  driver = config.client = new webdriver.Builder()
    .usingServer(config.seleniumAddress)
    .withCapabilities(config.capabilities)
    .build();

  driver.manage().timeouts().setScriptTimeout(100000);
  driver.getSession().then(function(session) {
    config.id = session.id;
  });
  jasmineNodeRunner(config, cleanup);
};

var cleanup = function(error, passed) {
  if (sauceAccount) {
    sauceAccount.updateJob(id, {'passed': passed}, function() {});
    process.exit(passed ? 0 : 1);
  }

  driver.quit().then(function() {
    /*if (server) {
      util.puts('Shutting down selenium standalone server');
      server.stop();
    }*/
  }).then(function() {
    process.exit(passed ? 0 : 1);
  });
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
  var server = config.server = new remote.SeleniumServer(webdriverSetup.selenium.path, {
    args: webdriverSetup.args.concat(config.seleniumArgs)
  });
  server.start().then(function(url) {
    console.log('Selenium standalone server started at ' + url);
    config.seleniumAddress = server.address();
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
  capabilities: {
    'browserName': 'safari'
  },
  specFolders: ['./src']
});*/

run({
  capabilities: {
    'browserName': 'phantomjs'
  },
  specFolders: ['./src']
});
