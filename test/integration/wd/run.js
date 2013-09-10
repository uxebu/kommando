var path = require('path');

var run = require('../../../src/index.js');

run({
  capabilities: [
    {browserName: 'phantomjs'},
    {browserName: 'chrome'}/*,
    {browserName: 'firefox'},
    {browserName: 'safari'}*/
  ],
  specs: [
    path.join(__dirname, 'foo.js')
  ],
  testRunner: path.join(__dirname, '..', '..', '..', 'src', 'runner', 'mocha.js'),
  webdriverClient: path.join(__dirname, '..', '..', '..', 'src', 'client', 'wd.js')
});
