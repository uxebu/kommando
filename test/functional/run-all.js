'use strict';

var async = require('async');
var path = require('path');

var lodash = require('lodash');
var run = require('../../src/index.js');

var capabilities = [{browserName: 'phantomjs'}];
var driver = 'phantomjs';

var configSeleniumWebdriverJasmine = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine', 'github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine', 'google-search.js')
  ]
};

var configSeleniumWebdriverJasmineWithHelper = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'jasmine-with-helper', 'github.js'),
    path.join(__dirname, 'selenium-webdriver', 'jasmine-with-helper', 'google-search.js')
  ],
  runnerModules: [
    'jasmine-selenium-webdriver'
  ]
};

var configSeleniumWebdriverPlain = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'plain', 'github.js')
  ],
  runner: 'plain'
};

var configSeleniumWebdriverMochaWithHelper = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'mocha-with-helper', 'github.js'),
    path.join(__dirname, 'selenium-webdriver', 'mocha-with-helper', 'google-search.js')
  ],
  runnerModules: [
    'mocha-selenium-webdriver'
  ],
  runnerOptions: {
    reporter: 'dot'
  },
  runner: 'mocha'
};

var configSeleniumWebdriverCucumber = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'selenium-webdriver', 'cucumber', 'github.feature')
  ],
  runner: 'cucumber',
  runnerOptions: {}
};

var configWdMocha = {
  driver: driver,
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'wd', 'mocha', 'github.js'),
    path.join(__dirname, 'wd', 'mocha', 'google-search.js')
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
    path.join(__dirname, 'wd-promise', 'mocha', 'github.js'),
    path.join(__dirname, 'wd-promise', 'mocha', 'google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'nyan'
  },
  client: 'wd-promise'
};

var configCabbieMocha = {
  // executing with selenium because cabbie in combination with Ghostdriver
  // currently fails with the initial session-request
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'cabbie', 'mocha', 'github.js'),
    path.join(__dirname, 'cabbie', 'mocha', 'google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'spec'
  },
  client: 'cabbie'
};

var configLeadfootMocha = {
  capabilities: capabilities,
  tests: [
    path.join(__dirname, 'leadfoot', 'mocha', 'github.js'),
    path.join(__dirname, 'leadfoot', 'mocha', 'google-search.js')
  ],
  runner: 'mocha',
  runnerOptions: {
    reporter: 'spec'
  },
  client: 'leadfoot'
};

async.series([
  run.bind(null, configSeleniumWebdriverJasmine),
  run.bind(null, configSeleniumWebdriverJasmineWithHelper),
  run.bind(null, configSeleniumWebdriverPlain),
  run.bind(null, configSeleniumWebdriverMochaWithHelper),
  run.bind(null, configSeleniumWebdriverCucumber),
  run.bind(null, configWdMocha),
  run.bind(null, configWdPromiseMocha),
  // Currently fails because of .get('value') call
  // run.bind(null, configCabbieMocha),
  run.bind(null, configLeadfootMocha)
], function(error, results) {
  var passed = lodash.every(lodash.map(results, function(result) {
    return lodash.every(result, 'passed');
  }));
  if (!passed) {
    error = new Error('One or more tests did not pass.');
  }

  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    process.exit(0);
  }
});
