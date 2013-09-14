module.exports = function(config, callback) {

  console.log('Using the selenium server at ' + config.seleniumUrl);

  callback(null, config.seleniumUrl, {}, function endSeleniumGrid(resultData, callback) {
    callback(null);
  });

};
