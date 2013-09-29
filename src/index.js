var fs = require('fs');
var path = require('path');

var async = require('async');
var glob = require('glob');
var lodash = require('lodash');

var defaultConfig = {
  browsers: ['phantomjs'],
  capabilities: [],
  tests: [],
  driver: 'selenium-server',
  driverOptions: {
    args: [],
    port: 0,
    hostname: '',
    stdio: 'inherit',
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    sauceName: undefined,
    sauceBuild: undefined,
    sauceTags: undefined,
    seleniumUrl: undefined,
    javaPath: 'java',
    appiumPath: 'appium'
  },
  client: 'selenium-webdriver',
  runner: 'jasmine-node',
  runnerOptions: {
    timeout: 10 * 1000
  },
  runnerModules: [
    'jasmine-selenium-webdriver'
  ],
  runnerKommandoGlobals: {}
};

var detectModulePath = function(moduleName, type) {
  var modulePath = path.join(__dirname, type, moduleName + '.js');
  if (fs.existsSync(modulePath)) {
    return modulePath;
  } else if (fs.existsSync(moduleName)) {
    return moduleName;
  } else {
    throw new Error('The passed "' + type + '" module "' + moduleName + '" was not found.');
  }
};

var run = function(config, callback) {
  config = lodash.extend({}, defaultConfig, config);

  var client = detectModulePath(config.client, 'client');
  var driver = require(detectModulePath(config.driver, 'driver'))(config.driverOptions);
  var runner = detectModulePath(config.runner, 'runner');
  var runnerModules = [];
  config.runnerModules.forEach(function(runnerModuleName) {
    runnerModules.push(detectModulePath(runnerModuleName, 'runner-module'));
  });

  // if no capabilities were passed use the passed browsers instead
  var capabilities = config.capabilities;
  if (capabilities.length === 0) {
    capabilities = config.browsers.map(function(browser) {
      return {
        browserName: browser
      };
    });
  }

  var tests = [];
  config.tests.forEach(function(test) {
    var testFiles = glob.sync(test);
    if (testFiles.length === 0) {
      throw new Error('No files found for glob pattern: ' + test);
    }
    tests = tests.concat(testFiles);
  });

  if (tests.length === 0) {
    throw new Error('No test files found.');
  }

  var runTestsFunctions = [];

  driver.start(function(error, seleniumUrl) {
    if (error) {
      console.error(error.stack);
      process.exit(1);
    }
    capabilities.forEach(function(capabilities) {
      capabilities = driver.updateCapabilities(capabilities);
      runTestsFunctions.push(runTests.bind(
        null, tests, seleniumUrl,
        capabilities, client, runner,
        config.runnerOptions, runnerModules, config.runnerKommandoGlobals
      ));
    });

    // Execute tests per capability / browser one after another
    async.series(runTestsFunctions, function(error, results) {
      if (error) {
        console.error(error.stack);
      }
      driver.stop(results, function(endError) {
        if (typeof callback === 'function') {
          callback(error && endError, results);
        }
      });
    });

  });
};

var runTests = function(
  tests, seleniumUrl, capabilities,
  client, runner, runnerOptions,
  runnerModules, runnerKommandoGlobals, callback
) {
  console.log('Run tests using "' + capabilities.browserName + '"');
  var child = require('child_process').fork(path.join(__dirname, 'run-tests.js'));
  var onExit = function(exitCode, signal) {
    if (exitCode) {
      callback(new Error('Error occurred executing run-tests process.'));
    }
  };
  child.send({
    seleniumUrl: seleniumUrl,
    capabilities: capabilities,
    client: client,
    runner: runner,
    runnerOptions: runnerOptions,
    runnerModules: runnerModules,
    runnerKommandoGlobals: runnerKommandoGlobals,
    tests: tests
  });
  child.on('message', function(msg) {
    callback(null, {
      passed: msg.passed,
      clientIds: msg.clientIds
    });
    child.removeListener('exit', onExit);
  });
  child.once('exit', onExit);
};

module.exports = run;
