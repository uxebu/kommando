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
  runner: 'mocha',
  client: 'wd'
});
