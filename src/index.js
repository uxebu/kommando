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
  runnerModules: [],
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
  config = lodash.merge({}, defaultConfig, config);

  var client = detectModulePath(config.client, 'client');
  var driver = require(detectModulePath(config.driver, 'driver'));
  var runner = detectModulePath(config.runner, 'runner');

  var runTestsFunctions = [];

  driver(config.driverArgs, function(error, seleniumUrl, capabiltiesAddon, endDriver) {
    if (error) {
      console.log(error);
      process.exit(error ? 0 : 1);
    }
    lodash.forEach(config.capabilities, function(capabilities) {
      lodash.merge(capabilities, capabiltiesAddon);
    });

    // Execute tests per capability / browser
    lodash.forEach(config.capabilities, function(capabilities) {
      runTestsFunctions.push(runTests.bind(
        null, config.tests, seleniumUrl, capabilities, client, runner, config.runnerArgs
      ));
    });

    async.series(runTestsFunctions, function(error, resultData) {
      var passed = lodash.every(resultData, 'passed');
      endDriver(resultData, function(error) {
        process.exit(!error && passed ? 0 : 1);
      });
    });

  });
};

var runTests = function(tests, seleniumUrl, capabilities, client, runner, runnerArgs, callback) {
  console.log('Run tests using "' + capabilities.browserName + '"');
  var child = require('child_process').fork(path.join(__dirname, 'child.js'));
  child.send({
    seleniumUrl: seleniumUrl,
    capabilities: capabilities,
    client: client,
    runner: runner,
    runnerArgs: runner,
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

module.exports = run;
