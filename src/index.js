var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');
var webdriverSetup = require('webdriver');
var vm = require('vm');

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

var vmCount = 0;
var seleniumServer;

var executeSpecs = function(error, config) {
  if (error) {
    throw error;
  }

  var clientModule = require('./selenium_webdriver.js');
  clientModule.create(config.seleniumAddress, config.capabilities, function(error, id, client) {
    var code = [
      'var runner = require(\'./jasmine_node/runner.js\');',
      'runner(runnerConfig, runnerCallback);'
    ].join('\n');
    var cleanup = function(error, passed) {
      clientModule.quit(client);
      vmCount--;
      cleanupServer(id, error, !!passed);
    };
  
    vm.runInNewContext(code, {
      console: console,
      require: require,
      seleniumAddress: config.seleniumAddress,
      seleniumCapabilities: config.capabilities,
      runnerCallback: cleanup,
      runnerConfig: {
        client: client,
        args: {
          specFolders: config.specFolders
        }
      }
    }, 'kommando-runner.vm');
    vmCount++;
  });
};

var cleanupServer = function(error, passed) {
  if (sauceAccount) {
    sauceAccount.updateJob(id, {passed: passed}, function() {});
  }

  if (vmCount === 0) {
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
    config.seleniumAddress = seleniumServer.address();
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
  capabilities: webdriver.Capabilities.phantomjs(),
  specFolders: ['./src']
});
