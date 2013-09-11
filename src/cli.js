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
  .option('selenium-args', {
    desc: 'Additional selenium arguments',
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

if (argv._.length < 1) {
  optimist.showHelp();
  console.log('Pass at least one test file.');
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
var sauceTags = typeof argv['sauce-tag'] === 'string' ? [argv['sauce-tag']] : argv['sauce-tag'];

kommandoRunner({
  capabilities: capabilities,
  sauceUser: argv['sauce-user'],
  sauceKey: argv['sauce-key'],
  sauceName: argv['sauce-name'],
  sauceBuild: argv['sauce-build'],
  sauceTags: sauceTags,
  seleniumArgs: argv['selenium-args'],
  seleniumUrl: argv['selenium-url'],
  specs: tests
});
