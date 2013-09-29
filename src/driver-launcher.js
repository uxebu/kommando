var http = require('http');
var spawn = require('child_process').spawn;
var url = require('url');

var lodash = require('lodash');

var DEFAULT_START_TIMEOUT_MS = 30 * 1000;
var POLL_TIMEOUT = 100;
var defaultOptions = {
  port: 0,
  hostname: 'localhost',
  args: [],
  path: '/',
  env: process.env,
  stdio: 'ignore',
  waitTimeout: DEFAULT_START_TIMEOUT_MS
};

module.exports = function(executable, options) {
  
  var processOptions = lodash.merge({}, defaultOptions, options);

  return {
    _process: null,
    _getStatus: function(url, callback) {
      http.get(url, function(response) {
        callback(null, response.statusCode);
      }).on('error', function(error) {
        callback(error);
      });
    },
    _waitForServer: function(url, timeout, callback) {
      var start = Date.now();
      var getStatus = this._getStatus.bind(this, url + '/status', onStatus);
      getStatus();

      function onStatus(error, statusCode) {
        if (!error && statusCode > 199 && statusCode < 300) {
          callback(null, url);
        } else if (Date.now() - start > timeout) {
          callback(new Error('Timed out waiting for server with URL: ' + url));
        } else {
          setTimeout(function() {
            getStatus();
          }, POLL_TIMEOUT);
        }
      }
    },
    start: function(callback) {
      var exitFunc = function(error) {
        callback(new Error([
          'Failed starting process: "',
          (executable + ' ' + processOptions.args.join(' ')),
          '"',
          error ? '\nError : ' + error.stack : ''
        ].join('')));
      };
      var serverUrl = url.format({
        protocol: 'http',
        hostname: processOptions.hostname,
        port: processOptions.port,
        pathname: processOptions.path
      });
      var childProcess = this._process = spawn(executable, processOptions.args, {
        stdio: processOptions.stdio
      });
      childProcess.once('exit', exitFunc);
      childProcess.once('error', exitFunc);

      this._waitForServer(serverUrl, processOptions.waitTimeout, function(error, url) {
        childProcess.removeListener('exit', exitFunc);
        childProcess.removeListener('error', exitFunc);
        callback(error, url);
      });
      return this;
    },
    stop: function(callback) {
      this._process.kill('SIGTERM');
      callback(null);
    }
  };

};
