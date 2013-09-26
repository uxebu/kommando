var spawn = require('child_process').spawn;

var freeport = require('freeport');
var webdrvr = require('webdrvr');

module.exports = function(config) {

  return {
    _iosDriverProcess: null,
    _seleniumUrl: '',
    create: function(callback) {
      console.log('Starting iOS-Driver server ...');

      freeport(function(err, port) {
        var child, seleniumUrl;
        var exitFunc = function(err) {
          callback(new Error([
            'Failed starting iOS-Driver.',
            err ? ': ' + err.stack : ''
          ].join('')));
        };

        if (err) {
          callback(err);
        } else {
          this._seleniumUrl = seleniumUrl = [
            'http://127.0.0.1:',
            port,
            '/wd/hub'
          ].join('');
          this._iosDriverProcess = child = spawn('java', [
            '-jar', webdrvr.iosdriver.path, '-simulators', '-port', port
          ], {
            stdio: [process.stderr]
          });
          child.stderr.on('data', function(data) {
            if (data.toString().indexOf('Started SelectChannelConnector') !== -1) {
              console.log('iOS-Driver server started at: ' + seleniumUrl);
              callback(null, seleniumUrl, {});
            }
          });
          child.once('exit', exitFunc);
          child.once('error', exitFunc);
        }

      }.bind(this));
    },
    end: function(results, callback) {
      console.log('Shutting down iOS-Driver server at: ' + this._seleniumUrl);
      this._iosDriverProcess.kill('SIGTERM');
      callback(null);
    }
  };

};
