var lodash = require('lodash');
var optimist = require('optimist');
var path = require('path');

var kommandoRunner = require('./index.js');

var packageJson = require(path.join(__dirname, '..', 'package.json'));

var argv = optimist
  .usage('Usage: \n  $0 [options] TESTFILES')
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
  .option('client', {
    alias: 'w',
    type: 'string',
    desc: 'Injected JS Webdriver client library',
    default: 'selenium-webdriver'
  })
  .option('runner', {
    alias: 'r',
    type: 'string',
    desc: 'Used test runner',
    default: 'jasmine-node'
  })
  .option('config', {
    alias: 'c',
    type: 'string',
    desc: 'Specifies JSON-formatted configuration file (CLI arguments overwrite config settings)'
  })
  .option('selenium-url', {
    desc: 'URL to a selenium server (e.g. http://localhost:4444/wd/hub)',
    type: 'string'
  })
  .option('sauce-user', {
    desc: 'Sauce Labs User',
    type: 'string'
  })
  .option('sauce-key', {
    desc: 'Sauce Labs Key',
    type: 'string'
  })
  .option('sauce-name', {
    desc: 'Name of the Sauce Labs job',
    type: 'string'
  })
  .option('sauce-build', {
    desc: 'Build number set for this Sauce Labs job',
    type: 'string'
  })
  .option('sauce-tag', {
    desc: 'Tag(s) for the Sauce Labs job',
    type: 'string'
  })
  .argv;

if (argv.version) {
  console.log(packageJson.version);
  process.exit(1);
}

if (argv.help) {
  optimist.showHelp();
  process.exit(1);
}

var browsers = typeof argv.browser === 'string' ? [argv.browser] : argv.browser;
var capabilities = browsers.map(function(browser) {
  return {
    browserName: browser
  };
});
var sauceTags = typeof argv['sauce-tag'] === 'string' ? [argv['sauce-tag']] : argv['sauce-tag'];

var kommandoConfig = argv.config ? require(path.resolve(argv.config)) : {};

lodash.merge(kommandoConfig, {
  client: argv['client'],
  runner: argv['runner'],
  capabilities: capabilities,
  sauceUser: argv['sauce-user'],
  sauceKey: argv['sauce-key'],
  sauceName: argv['sauce-name'],
  sauceBuild: argv['sauce-build'],
  sauceTags: sauceTags,
  seleniumUrl: argv['selenium-url'],
  specs: argv._
});

if (kommandoConfig.specs.length < 1) {
  optimist.showHelp();
  console.log('Pass at least one test file.');
  process.exit(1);
}

// resolve test-files of config-file relative to it
var pathFrom = argv.config ? path.dirname(path.resolve(argv.config)) : process.cwd();

kommandoConfig.specs = kommandoConfig.specs.map(function(test) {
  return path.resolve(pathFrom, test);
});

kommandoRunner(kommandoConfig);
