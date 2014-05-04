'use strict';

var Cucumber = require('cucumber');

module.exports = function(config) {
  var cucumber;
  var execOptions = ['node', 'node_modules/.bin/cucumber-js'];
  var runnerOptions = config.runnerOptions;

  global.kommando = config.kommando;

  execOptions = execOptions.concat(config.tests);

  if (runnerOptions.requires) {
    runnerOptions.requires.forEach(function(cucumberRequire) {
      execOptions.push('-r', cucumberRequire);
    });
  }

  if (runnerOptions.tags) {
    runnerOptions.tags.forEach(function(cucumberTag) {
      execOptions.push('-t', cucumberTag);
    });
  }

  if (runnerOptions.format) {
    execOptions.push('-f', runnerOptions.format);
  }

  cucumber = Cucumber.Cli(execOptions);

  return {
    run: function(callback) {
      cucumber.run(function(succeeded) {
        callback(null, succeeded);
      });
    }
  };

};
