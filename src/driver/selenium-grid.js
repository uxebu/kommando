module.exports = function(config) {

  return {
    create: function(callback) {
      console.log('Using the selenium server at ' + config.seleniumUrl);
      callback(null, config.seleniumUrl, {});
    },
    end: function(results, callback) {
      callback(null);
    }
  };

};
