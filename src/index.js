var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');

var jasmineNodeRunner = require('./jasmine_node/runner.js');

// Default configuration.
/*var config = {
  seleniumServerJar: null,
  seleniumArgs: [],
  seleniumPort: null,
  seleniumAddress: null,
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    specs: [],
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
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
  } else if (config.seleniumServerJar) {
    console.log('Starting selenium standalone server...');
    runWithSeleniumServerJar(config, executeSpecs);
  } else {
    // error
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

var runWithSeleniumServerJar = function(config, callback) {
  if (config.chromeDriver) {
    if (!fs.existsSync(config.chromeDriver)) {
      if (fs.existsSync(config.chromeDriver + '.exe')) {
        config.chromeDriver += '.exe';
      } else {
        callback('Could not find chromedriver at ' + config.chromeDriver);
      }
    }
    config.seleniumArgs.push('-Dwebdriver.chrome.driver=' + config.chromeDriver);
  }
  var server = config.server = new remote.SeleniumServer({
    jar: config.seleniumServerJar,
    args: config.seleniumArgs,
    port: config.seleniumPort
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

run({
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome'
  }
});
/*run({
  seleniumServerJar: './vendor/selenium-server-standalone-2.33.0.jar',
  seleniumArgs: [],
  seleniumPort: 4445,
  chromeDriver: './vendor/chromedriver',
  capabilities: {
    'browserName': 'chrome'
  }
});*/
