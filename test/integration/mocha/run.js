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
    path.join(__dirname, 'foo.js'),
    path.join(__dirname, 'bar.js')
  ],
  runner: 'mocha'
});
