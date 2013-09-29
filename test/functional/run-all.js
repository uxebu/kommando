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

var configSeleniumWebdriverMocha = {
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'mocha-github.js'),
    path.join(__dirname, 'selenium-webdriver', 'mocha-google-search.js')
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
  runnerModules: [],
  client: 'wd'
};

run(configSeleniumWebdriverJasmine, function(error, results) {
  handleErrorCallback(error, results);
  run(configSeleniumWebdriverMocha, function(error, results) {
    handleErrorCallback(error, results);
    run(configWdMocha, function(error, results) {
      process.exit(0);
    });
  });
});

function handleErrorCallback(error, results) {
  var passed = lodash.every(results, 'passed');
  if (error || !passed) {
    process.exit(1);
  }
}
