var Mocha = require('mocha');
var mochaWd = require('./mochawd.js');;

var mochaInstance;

module.exports = {
  setup: function(config) {
    var options = {
      globals: ['should', 'kommando'],
      timeout: 3000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    };
    global.kommando = config.kommando;
    mochaInstance = new Mocha(options);
    mochaInstance.suite.title = config.kommando.capabilities.browserName;

    if (config.kommando.server.type === 'selenium-webdriver') {
      mochaInstance.suite.on('pre-require', function(context, file, mocha) {
        // just works for mocha's "bdd"-interface at the moment
        context.after = mochaWd.wrapped(context.after);
        context.afterEach = mochaWd.wrapped(context.afterEach);
        context.before = mochaWd.wrapped(context.before);
        context.beforeEach = mochaWd.wrapped(context.beforeEach);

        context.it = mochaWd.wrapped(context.it);
        context.it.only = context.iit = mochaWd.wrapped(context.it.only);
        context.it.skip = context.xit = mochaWd.wrapped(context.xit);

        context.ignore = mochaWd.ignore;
      });
    }

    for (var i = 0, l = config.runnerArgs.specs.length; i < l; i++) {
      mochaInstance.addFile(config.runnerArgs.specs[i]);
    }
  },
  run: function(callback) {
    mochaInstance.run(function(errCount) {
      callback(null, errCount === 0);
    });
  }
};
