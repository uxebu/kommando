'use strict';

module.exports = function(callback) {
  kommando.browser.get('https://www.github.com').then(function() {
    return kommando.browser.findElement(kommando.webdriver.By.className('heading'));
  }).then(function(heading) {
    return heading.getText();
  }).then(function(text) {
    if (text === 'Build software better, together.') {
      callback(null);
    } else {
      callback(new Error('Heading-text did not match'));
    }
  }).then(callback, callback);
};
