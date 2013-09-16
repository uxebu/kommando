var lodash = require('lodash');
var optimist = require('optimist');
var path = require('path');

var kommandoRunner = require('./index.js');

var packageJson = require(path.join(__dirname, '..', 'package.json'));

var argv = optimist
  .usage('Usage: \n  $0 [options] TESTFILE(S) # allows globbing')
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
  .option('driver', {
    alias: 'd',
    type: 'string',
    desc: 'Driver providing Selenium URL'
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
  .option('runner-module', {
    alias: 'm',
    type: 'string',
    desc: 'Runner module(s) that are loaded in runner context before tests get added',
    default: 'jasmine-selenium-webdriver'
  })
  .option('runner-arg-*', {
    type: 'string',
    desc: 'Argument(s) for a specific test runner. Overriding default arguments of runner. (e.g. --runner-arg-isVerbose or --runner-arg-ui tdd)'
  })
  .option('runner-global-*', {
    type: 'string',
    desc: 'Global(s) which will be available within the `kommando` runner global (e.g. --runner-global-baseUrl http://localhost or --runner-global-env dev)'
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

function convertArgToArray(argv, argName) {
  var arg = argv[argName];
  if (!arg) {
    return [];
  } else if (lodash.isArray(arg)) {
    return arg;
  } else {
    return [arg];
  }
}

function collectArgsWithPrefix(argv, argPrefix) {
  var obj = {};
  Object.keys(argv).forEach(function(key) {
    if (key.indexOf(argPrefix) === 0) {
      obj[key.slice(argPrefix.length)] = argv[key];
    }
  });
  return obj;
}

var runnerArgs = collectArgsWithPrefix(argv, 'runner-arg-');
var runnerKommandoGlobals = collectArgsWithPrefix(argv, 'runner-global-');
var runnerModules = convertArgToArray(argv, 'runner-module');
var sauceTags = convertArgToArray(argv, 'sauce-tag');

// read config when it was passed
var kommandoConfig = argv.config ? require(path.resolve(argv.config)) : {};

// autodetect "driver"
if (!argv.driver && !kommandoConfig.driver) {
  if (argv['sauce-user'] && argv['sauce-key']) {
    argv.driver = 'saucelabs';
  } else if (argv['selenium-url']) {
    argv.driver = 'selenium-gird';
  } else {
    argv.driver = 'selenium-server';
  }
}

var capabilities = kommandoConfig.capabilities;

if (!capabilities) {
  var browsers = convertArgToArray(argv, 'browser');
  capabilities = browsers.map(function(browser) {
    return {
      browserName: browser
    };
  });
}

lodash.merge(kommandoConfig, {
  client: argv['client'],
  driver: argv['driver'],
  driverArgs: {
    sauceUser: argv['sauce-user'],
    sauceKey: argv['sauce-key'],
    sauceName: argv['sauce-name'],
    sauceBuild: argv['sauce-build'],
    sauceTags: sauceTags,
    seleniumUrl: argv['selenium-url']
  },
  runner: argv['runner'],
  runnerArgs: runnerArgs,
  runnerKommandoGlobals: runnerKommandoGlobals,
  runnerModules: runnerModules,
  capabilities: capabilities,
  tests: argv._
});

if (kommandoConfig.tests.length < 1) {
  optimist.showHelp();
  console.log('Pass at least one test file.');
  process.exit(1);
}

// resolve test-files of config-file relative to it
var pathFrom = argv.config ? path.dirname(path.resolve(argv.config)) : process.cwd();

kommandoConfig.tests = kommandoConfig.tests.map(function(test) {
  return path.resolve(pathFrom, test);
});

kommandoRunner(kommandoConfig, function(error, results) {
  var passed = lodash.every(results, 'passed');
  process.exit(!error && passed ? 0 : 1);
});
