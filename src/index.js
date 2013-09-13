var fs = require('fs');
var path = require('path');

var async = require('async');
var lodash = require('lodash');

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

  var driver;

  if (config.sauceUser && config.sauceKey) {
    driver = require('./driver/saucelabs');
  } else if (config.seleniumUrl) {
    driver = require('./driver/selenium_grid');
  } else {
    driver = require('./driver/selenium_server');
  }

  driver(config, function(error, driverData) {
    if (error) {
      console.log(error);
      shutdown(error);
    }
    config.seleniumUrl = driverData.seleniumUrl;
    lodash.forEach(config.capabilities, function(capabilities) {
      lodash.merge(capabilities, driverData.capabilities);
    });
    executeTests(config, function(error, resultData) {
      var passed = lodash.every(resultData, 'passed');
      driverData.end(resultData, function(error) {
        shutdown(error || !passed);
      });
    });
  });
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

var executeTests = function(config, callback) {
  var capabilities = config.capabilities;
  var runTestsFunctions = [];

  for (var i = 0, l = capabilities.length; i < l; i++) {
    runTestsFunctions.push(runTests.bind(
      this, config.tests, config.seleniumUrl, capabilities[i], config.client, config.runner
    ));
  }

  async.series(runTestsFunctions, callback);
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

var shutdown = function(error) {
  process.exit(error ? 0 : 1);
};

module.exports = run;
