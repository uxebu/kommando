'use strict';

var fs = require('fs');
var path = require('path');

var async = require('async');
var glob = require('glob');
var lodash = require('lodash');

var parentModuleDir = path.dirname(module.parent.filename);
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
    timeout: 100 * 1000,
    // jasmine-node defaults
    isVerbose: false,
    showColors: true,
    teamcity: false,
    junitreport: {
      report: false,
      savePath : "./reports/",
      useDotNotation: true,
      consolidate: true
    },
    // mocha defaults
    globals: ['should', 'kommando'],
    ignoreLeaks: false,
    ui: 'bdd',
    reporter: 'dot'
  },
  runnerModules: null,
  runnerKommandoGlobals: {}
};

var detectModulePath = function(moduleName, type) {
  var modulePath = path.join(__dirname, type, moduleName + '.js');
  var relativeToParentPath = path.resolve(parentModuleDir, moduleName);
  if (fs.existsSync(modulePath)) {
    return modulePath;
  } else if (fs.existsSync(moduleName)) {
    return moduleName;
  } else if (fs.existsSync(relativeToParentPath)) {
    return relativeToParentPath;
  } else {
    throw new Error('The passed "' + type + '" module "' + moduleName + '" was not found.');
  }
};

var run = function(config, callback) {
  config = lodash.merge({}, defaultConfig, config);

  var client = detectModulePath(config.client, 'client');
  var driver = require(detectModulePath(config.driver, 'driver'))(config.driverOptions);
  var runner = detectModulePath(config.runner, 'runner');
  var runnerModules = [];
  lodash.forEach(config.runnerModules, function(runnerModuleName) {
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
  lodash.forEach(config.tests, function(test) {
    test = path.resolve(parentModuleDir, test);
    var testFiles = glob.sync(test);
    if (testFiles.length === 0) {
      throw new Error('No files found for glob pattern: ' + test);
    }
    tests = tests.concat(testFiles);
  });

  if (config.runner !== 'repl' && tests.length === 0) {
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
  var capabilitiesName = flattenCapabilities(capabilities);
  console.log('Run tests using "' + capabilitiesName + '"');
  var child = require('child_process').fork(path.join(__dirname, 'run-tests.js'));
  var onExit = function(exitCode) {
    if (exitCode) {
      callback(new Error('Error occurred executing run-tests process.'), {
        passed: false
      });
    }
  };
  child.send({
    seleniumUrl: seleniumUrl,
    capabilities: capabilities,
    capabilitiesName: capabilitiesName,
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
      clientIds: msg.clientIds,
      data: msg.data
    });
    child.removeListener('exit', onExit);
  });
  child.once('exit', onExit);
};

// avoid sensitive information (in this case of SauceLabs)
var IGNORED_CAPS_PROPERTIES = ['accessKey', 'username'];
var flattenCapabilities = function(caps) {
  var retCaps = [];
  lodash.forEach(caps, function(value, key) {
    if (IGNORED_CAPS_PROPERTIES.indexOf(key) === -1) {
      retCaps.push(key + '=' + value);
    }
  });
  return retCaps.join(',');
};

module.exports = run;
