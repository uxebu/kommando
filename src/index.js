var util = require('util');
var path = require('path')
var fs = require('fs');
var lodash = require('lodash');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var SauceLabs = require('saucelabs');
var webdrvr = require('webdrvr');
var async = require('async');

var defaultConfig = {
  capabilities: [],
  tests: [],
  client: 'selenium-webdriver',
  runner: 'jasmine-node',
  runnerArgs: {},
  runnerModules: [],
  runnerGlobals: [],
  sauceUser: undefined,
  sauceKey: undefined,
  sauceName: undefined,
  sauceBuild: undefined,
  sauceTags: undefined,
  seleniumUrl: undefined
};

var run = function(config) {
  config = lodash.merge({}, defaultConfig, config);

  config.runner = detectRunner(config.runner);
  config.client = detectClient(config.client);

  if (config.sauceUser && config.sauceKey) {
    runWithSauceLabs(config, executeTests);
    console.log('Using SauceLabs selenium server at ' + config.seleniumUrl);
  } else if (config.seleniumUrl) {
    runWithSeleniumAddress(config, executeTests);
    console.log('Using the selenium server at ' + config.seleniumUrl);
  } else {
    console.log('Starting selenium standalone server...');
    runWithSeleniumServer(config, executeTests);
  }
};

var detectRunner = function(runner) {
  var runnerPath = path.join(__dirname, 'runner', runner + '.js');
  if (fs.existsSync(runner)) {
    return client;
  } else if (fs.existsSync(runnerPath)) {
    return runnerPath;
  } else {
    throw new Error('The passed "runner" module "' + runner + '" was not found.')
  }
};

var detectClient = function(client) {
  var clientPath = path.join(__dirname, 'client', client + '.js');
  if (fs.existsSync(client)) {
    return client;
  } else if (fs.existsSync(clientPath)) {
    return clientPath;
  } else {
    throw new Error('The passed "client" module "' + client + '" was not found.')
  }
}

var executeTests = function(error, config) {
  if (error) {
    throw error;
  }

  var capabilities = config.capabilities;
  var runTestsFunctions = [];

  for (var i = 0, l = capabilities.length; i < l; i++) {
    runTestsFunctions.push(runTests.bind(
      this, config.tests, config.seleniumUrl, capabilities[i], config.client, config.runner
    ));
  }

  async.series(runTestsFunctions, function(error, results) {
    var sauceUpdateFunctions = [];
    if (config.sauceAccount) {
      lodash.forEach(results, function(result) {
        sauceUpdateFunctions.push(
          config.sauceAccount.updateJob.bind(config.sauceAccount, result.clientId, {passed: result.passed})
        );
      });
      async.series(sauceUpdateFunctions, function(err) {
        shutdown(config, error, results);
      })
    } else {
      shutdown(config, error, results);
    }
  });
};

var runTests = function(tests, seleniumUrl, capabilities, client, runner, callback) {
  console.log('Run tests using "' + capabilities.browserName + '"');
  var child = require('child_process').fork(path.join(__dirname, 'child.js'));
  child.send({
    seleniumUrl: seleniumUrl,
    capabilities: capabilities,
    client: client,
    runner: runner,
    tests: tests
  });
  child.on('message', function(msg) {
    child.disconnect();
    callback(msg.error, {
      passed: msg.passed,
      clientId: msg.clientId
    });
  });
};

var shutdown = function(config, error, results) {
  var passed = lodash.every(results, 'passed');

  if (config.seleniumServer) {
    console.log('Shutting down selenium standalone server');
    config.seleniumServer.stop();
  }

  process.exit(passed ? 0 : 1);
};

var runWithSauceLabs = function(config, callback) {
  if (config.sauceUser && config.sauceKey) {
    config.sauceAccount = new SauceLabs({
      username: config.sauceUser,
      password: config.sauceKey
    });
  }

  lodash.forEach(config.capabilities, function(capabilities) {
    lodash.extend(capabilities, {
      username: config.sauceUser,
      accessKey: config.sauceKey,
      name: config.sauceName,
      build: config.sauceBuild,
      tags: config.sauceTags
    });
  });
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
  config.seleniumServer = new remote.SeleniumServer(webdrvr.selenium.path, {
    args: webdrvr.args.concat(config.seleniumArgs)
  });
  config.seleniumServer.start().then(function(url) {
    console.log('Selenium standalone server started at ' + url);
    config.seleniumUrl = url;
    callback(null, config);
  });
};

module.exports = run;
