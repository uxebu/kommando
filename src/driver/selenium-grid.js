module.exports = function(config, callback) {

  console.log('Using the selenium server at ' + config.seleniumUrl);

  callback(null, {
    seleniumUrl: config.seleniumUrl,
    capabilities: {},
    end: function(resultData, callback) {
      callback(null);
    }
  });

};
