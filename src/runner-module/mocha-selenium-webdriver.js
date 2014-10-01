var mochaSeleniumWebdriverHelper = require('selenium-webdriver/testing');

for (var key in mochaSeleniumWebdriverHelper) {
  global[key] = mochaSeleniumWebdriverHelper[key];
}

global.it.only = mochaSeleniumWebdriverHelper.iit;
