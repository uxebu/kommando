var mochaMethods = require('selenium-webdriver/testing');

for (var key in mochaMethods) {
  global[key] = mochaMethods[key];
}
