var nesh = require("nesh");

var async = require('async');
var lodash = require('lodash');

module.exports = function(config) {
  global.kommando = config.kommando;

  config.runnerModules.forEach(function(runnerModule) {
    require(runnerModule);
  });

  return {
    run: function(callback) {
      nesh.config.load();
      nesh.start({
        prompt: "kommando> ",
        input: process.stdin,
        output: process.stdout,
        historyFile: process.env.HOME + '/.kommando_history'
      }, function(err, repl) {
        if (err) {
          callback(err, true, []);
        }
        repl.on('exit', function() {
          callback(null, true, []);;
        });
      });
    }
  };

};
