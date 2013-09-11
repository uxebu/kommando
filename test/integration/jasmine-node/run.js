var path = require('path');

var run = require('../../../src/index.js');

run({
  capabilities: [
    {browserName: 'phantomjs'},
    {browserName: 'chrome'}/*,
    {browserName: 'firefox'},
    {browserName: 'safari'}*/
  ],
  tests: [
    path.join(__dirname, 'foo-spec.js'),
    path.join(__dirname, 'bar-spec.js')
  ]
});
/*run({
  seleniumUrl: 'http://localhost:9004/wd/hub',
  capabilities: [
    {
      device: 'iPhone Simulator',
      name: "Appium Hybrid App: with WD",
      app: "safari",
      version: '6.1',
      browserName: ''
    }
  ],
  tests: [
    path.join(__dirname, 'foo-spec.js'),
    path.join(__dirname, 'bar-spec.js')
  ]
});*/
