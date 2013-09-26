module.exports = function(options) {

  return {
    create: function(callback) {
      console.log('Using the selenium server at ' + options.seleniumUrl);
      callback(null, options.seleniumUrl, {});
    },
    end: function(results, callback) {
      callback(null);
    }
  };

};
