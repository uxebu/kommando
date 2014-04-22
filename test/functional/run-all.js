var path = require('path');

var lodash = require('lodash');
var run = require('../../src/index.js');

var capabilities = [{browserName: 'phantomjs'}];
var driver = 'phantomjs';

var configSeleniumWebdriverJasmine = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-google-search.js')
  ]
};

var configSeleniumWebdriverJasmineWithHelper = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-selenium-webdriver', 'jasmine-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-selenium-webdriver', 'jasmine-google-search.js')
  ],
  runnerModules: [
    'jasmine-selenium-webdriver'
  ]
};

var configPlainJasmine = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'plain-github.js')
  ],
  runner: 'plain'
};

var configSeleniumWebdriverMochaWithHelper = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'mocha-selenium-webdriver', 'mocha-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'mocha-selenium-webdriver', 'mocha-google-search.js')
  ],
  runnerModules: [
    'mocha-selenium-webdriver'
  ],
  runnerOptions: {
    reporter: 'dot'
  },
  runner: 'mocha'
};

var configWdMocha = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'wd', 'mocha-github.js'),
    path.join(__dirname, 'wd', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'spec'
  },
  client: 'wd'
};

var configWdPromiseMocha = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'wd-promise', 'mocha-github.js'),
    path.join(__dirname, 'wd-promise', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'nyan'
  },
  client: 'wd-promise'
};

run(configSeleniumWebdriverJasmine, function(error, results) {
  handleErrorCallback(error, results);
  run(configSeleniumWebdriverJasmineWithHelper, function(error, results) {
    handleErrorCallback(error, results);
    run(configPlainJasmine, function(error, results) {
      handleErrorCallback(error, results);
      run(configSeleniumWebdriverMochaWithHelper, function(error, results) {
        handleErrorCallback(error, results);
        run(configWdMocha, function(error, results) {
          handleErrorCallback(error, results);
          run(configWdPromiseMocha, function(error, results) {
            handleErrorCallback(error, results);
            process.exit(0);
          });
        });
      });
    });
  });
});

function handleErrorCallback(error, results) {
  var passed = lodash.every(results, 'passed');
  if (error || !passed) {
    process.exit(1);
  }
}
