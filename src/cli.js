var optimist = require('optimist');
var path = require('path');

var kommandoRunner = require('./index.js');

var packageJson = require(path.join(__dirname, '..', 'package.json'));

var argv = optimist
  .usage('$0 [options] TESTFILES')
  .wrap(80)
  .option('version', {
    alias: 'v',
    desc: 'Prints out kommando version'
  })
  .option('help', {
    alias: 'h',
    desc: 'Show this message and quits'
  })
  .option('browser', {
    alias: 'b',
    type: 'string',
    desc: 'Browser(s) in which the tests should be executed',
    default: 'phantomjs'
  })
  .option('selenium-url', {
    desc: 'URL to a selenium server (e.g. http://localhost:4444/wd/hub)',
    type: 'string'
  })
  .option('sauce-user', {
    desc: 'Sauce Labs User'
  })
  .option('sauce-key', {
    desc: 'Sauce Labs Key'
  })
  .demand('_')
  .argv;

if (argv.version) {
  console.log(packageJson.version);
  process.exit(1);
}

if (argv.help) {
  optimist.showHelp();
  process.exit(1);
}

var tests = argv._.map(function(test) {
  return path.resolve(test);
});

var browsers = typeof argv.browser === 'string' ? [argv.browser] : argv.browser;
var capabilities = browsers.map(function(browser) {
  return {
    browserName: browser
  };
});

kommandoRunner({
  capabilities: capabilities,
  sauceUser: argv['sauce-user'],
  sauceKey: argv['sauce-key'],
  seleniumUrl: argv['selenium-url'],
  specs: tests
});
