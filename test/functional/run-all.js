var path = require('path');

var lodash = require('lodash');
var run = require('../../src/index.js');

var capabilities = [{browserName: 'phantomjs'}];

var configSeleniumWebdriverJasmine = {
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-google-search.js')
  ]
};

var configSeleniumWebdriverJasmineWithHelper = {
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-selenium-webdriver', 'jasmine-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-selenium-webdriver', 'jasmine-google-search.js')
  ],
  runnerModules: [
    'jasmine-selenium-webdriver'
  ]
};

var configSeleniumWebdriverMochaWithHelper = {
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'mocha-selenium-webdriver', 'mocha-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'mocha-selenium-webdriver', 'mocha-google-search.js')
  ],
  runnerModules: [
    'mocha-selenium-webdriver'
  ],
  runner: 'mocha'
};

var configWdMocha = {
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'wd', 'mocha-github.js'),
    path.join(__dirname, 'wd', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'nyan'
  },
  client: 'wd'
};

run(configSeleniumWebdriverJasmine, function(error, results) {
  handleErrorCallback(error, results);
  run(configSeleniumWebdriverJasmineWithHelper, function(error, results) {
    handleErrorCallback(error, results);
    run(configSeleniumWebdriverMochaWithHelper, function(error, results) {
      handleErrorCallback(error, results);
      run(configWdMocha, function(error, results) {
        process.exit(0);
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
