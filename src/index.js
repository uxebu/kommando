var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');
var webdrvr = require('webdrvr');
var async = require('async');

var seleniumServer;

var executeSpecs = function(error, config) {
  if (error) {
    throw error;
  }

  var capabilities = config.capabilities;
  var runSpecsFunctions = [];

  for (var i = 0, l = capabilities.length; i < l; i++) {
    runSpecsFunctions.push(runSpecs.bind(
      this, config.specs, config.seleniumUrl, capabilities[i], config.webdriverClient, config.testRunner
    ));
  }

  async.series(runSpecsFunctions, function(error, results) {
    console.log(error, results);
    cleanupServer(null, true);
  });
};

var runSpecs = function(specs, seleniumUrl, capabilities, webdriverClient, testRunner, callback) {
  console.log('Run specs using "' + capabilities.browserName + '"');
  var child = require('child_process').fork(path.join(__dirname, 'child.js'));
  child.send({
    seleniumUrl: seleniumUrl,
    capabilities: capabilities,
    webdriverClient: webdriverClient,
    testRunner: testRunner,
    runnerArgs: {
      specs: specs
    }
  });
  child.on('message', function(msg) {
    child.disconnect();
    callback(msg.error, {
      passed: msg.passed,
      clientId: msg.clientId
    });
  });
};

var cleanupServer = function(error, passed) {
  if (sauceAccount) {
    sauceAccount.updateJob(id, {passed: passed}, function() {});
  }

  if (seleniumServer) {
    console.log('Shutting down selenium standalone server');
    seleniumServer.stop();
  }
  process.exit(passed ? 0 : 1);
};

var run = function(config) {
  if (!config.webdriverClient) {
    config.webdriverClient = path.join(__dirname, 'client', 'selenium_webdriver.js');
  }
  if (!config.testRunner) {
    config.testRunner = path.join(__dirname, 'runner', 'jasmine_node.js');
  }
  if (config.sauceUser && config.sauceKey) {
    runWithSauceLabs(config, executeSpecs);
    console.log('Using SauceLabs selenium server at ' + config.seleniumUrl);
  } else if (config.seleniumUrl) {
    runWithSeleniumAddress(config, executeSpecs);
    console.log('Using the selenium server at ' + config.seleniumUrl);
  } else {
    console.log('Starting selenium standalone server...');
    runWithSeleniumServer(config, executeSpecs);
  }
};

var runWithSauceLabs = function(config, callback) {
  config.capabilities.username = config.sauceUser;
  config.capabilities.accessKey = config.sauceKey;
  config.seleniumUrl = [
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
  seleniumServer = new remote.SeleniumServer(webdrvr.selenium.path, {
    args: webdrvr.args.concat(config.seleniumArgs)
  });
  seleniumServer.start().then(function(url) {
    console.log('Selenium standalone server started at ' + url);
    config.seleniumUrl = url;
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
