var fs = require('fs');
var path = require('path');

var async = require('async');
var lodash = require('lodash');

var defaultConfig = {
  capabilities: [],
  tests: [],
  driver: 'selenium-server',
  client: 'selenium-webdriver',
  runner: 'jasmine-node',
  runnerArgs: {},
  driverArgs: {},
  runnerModules: [
    'jasmine-selenium-webdriver'
  ],
  runnerGlobals: {},
  sauceUser: undefined,
  sauceKey: undefined,
  sauceName: undefined,
  sauceBuild: undefined,
  sauceTags: undefined,
  seleniumUrl: undefined
};

var detectModulePath = function(moduleName, type) {
  var modulePath = path.join(__dirname, type, moduleName + '.js');
  if (fs.existsSync(moduleName)) {
    return moduleName;
  } else if (fs.existsSync(modulePath)) {
    return modulePath;
  } else {
    throw new Error('The passed "' + type + '" module "' + moduleName + '" was not found.')
  }
};

var run = function(config) {
  config = lodash.extend({}, defaultConfig, config);

  var client = detectModulePath(config.client, 'client');
  var driver = require(detectModulePath(config.driver, 'driver'))(config.driverArgs);
  var runner = detectModulePath(config.runner, 'runner');

  var runnerModules = [];
  config.runnerModules.forEach(function(runnerModuleName) {
    runnerModules.push(detectModulePath(runnerModuleName, 'runner_module'));
  });
  config.runnerModules = runnerModules;

  var runTestsFunctions = [];

  driver.create(function(error, seleniumUrl, capabiltiesAddon) {
    if (error) {
      console.log(error);
      process.exit(error ? 0 : 1);
    }
    config.capabilities.forEach(function(capabilities) {
      lodash.merge(capabilities, capabiltiesAddon);
      runTestsFunctions.push(runTests.bind(
        null, config.tests, seleniumUrl, capabilities, client, runner, config.runnerArgs, config.runnerModules
      ));
    });

    // Execute tests per capability / browser one after another
    async.series(runTestsFunctions, function(error, results) {
      var passed = lodash.every(results, 'passed');
      driver.end(results, function(error) {
        process.exit(!error && passed ? 0 : 1);
      });
    });

  });
};

var runTests = function(tests, seleniumUrl, capabilities, client, runner, runnerArgs, runnerModules, callback) {
  console.log('Run tests using "' + capabilities.browserName + '"');
  var child = require('child_process').fork(path.join(__dirname, 'run-tests.js'));
  child.send({
    seleniumUrl: seleniumUrl,
    capabilities: capabilities,
    client: client,
    runner: runner,
    runnerArgs: runnerArgs,
    runnerModules: runnerModules,
    tests: tests
  });
  child.on('message', function(msg) {
    child.disconnect();
    callback(msg.error, {
      passed: msg.passed,
      clientIds: msg.clientIds
    });
  });
};

module.exports = run;
