var path = require('path');

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
    path.join(__dirname, 'swd', 'mocha-google-search.js')
  ],
  runner: 'mocha',
  runnerModules: [],
  client: 'wd'
};

run(configSeleniumWebdriverJasmine, function(error, passed) {
  run(configSeleniumWebdriverMocha, function(error, passed) {
    run(configWdMocha, function(error, passed) {
      console.log('eeeeend');
    });
  });
});
