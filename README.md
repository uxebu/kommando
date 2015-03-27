# kommando

[![Build Status](https://travis-ci.org/uxebu/kommando.png?branch=master)](https://travis-ci.org/uxebu/kommando)

kommando is a configurable cross browser functional / acceptance test launcher
(using [Webdriver](http://code.google.com/p/selenium/)).

It helps you to get started writing functional cross browser tests using JavaScript without knowing
details how to properly setup the various Webdriver servers locally, while still allowing to run
your created tests on an existing [Selenium Grid](http://code.google.com/p/selenium/wiki/Grid2)
(including [SauceLabs](http://saucelabs.com/), [BrowserStack](http://browserstack.com/) or
[TestingBot](http://testingbot.com/)).

For each test launch you can configure a test-runner that should be used to execute tests (currently
[jasmine-node](https://npmjs.org/package/jasmine-node), [mocha](https://npmjs.org/package/mocha)) or
[cucumber](https://npmjs.org/package/cucumber) and you can tell which Webdriver JS lib should be 
used to create a Webdriver client session (e.g.
[selenium-webdriver](https://npmjs.org/package/selenium-webdriver), [leadfoot](https://github.com/theintern/leadfoot),
[wd](https://npmjs.org/package/wd) or [cabbie](https://www.npmjs.org/package/cabbie)) per browser. 
The configured Webdriver client session then gets injected into the test runner execution context and
can then be used there.

This project is aimed for finding the best suited approach to write your functional cross browser
tests using JavaScript by allowing you to choose a test style (jasmine, mocha) you already are
familiar with and using a Webdriver JS library that you like the most. To simplify working with the
promise-based API of [selenium-webdriver](https://npmjs.org/package/selenium-webdriver) kommando
contains runner modules that tie the test runner to the control-flow of this promise-based API.

## Prerequisites

- Java (`>= 1.7` if you want to use iOS-Driver)
- [optional] Appium (can be installed through `npm install appium -g`)

## Installation

~~~bash
npm install kommando -g
~~~

## Executing REPL

Kommando provides a REPL runner which you can use to play with an individual Webdriver library.

~~~bash
# REPL with selenium-webdriver library and phantomjs
kommando --runner repl
# REPL with selenium-webdriver library and chrome
kommando --runner repl --browser chrome
# REPL with leadfoot
kommando --runner repl --browser chrome --client leadfoot
# REPL with cabbie
kommando --runner repl --browser chrome --client cabbie
# REPL with wd
kommando --runner repl --browser chrome --client wd
# REPL with wd-promise
kommando --runner repl --browser chrome --client wd-promise
~~~

## Writing your first functional test for kommando

~~~js
// mytest.js (using jasmine syntax)
describe('github', function() {
  it('reads the "title"', function(done) {
    // the global "kommando.browser" provides the initialized Webdriver session
    // using "selenium-webdriver" as default Webdriver library
    kommando.browser.get('https://www.github.com').then(function() {
      return kommando.browser.findElement(kommando.webdriver.By.className('heading'));
    }).then(function(heading) {
      return heading.getText();
    }).then(function(text) {
      expect(text).toBe('Build software better, together.');
    }).then(done, done); // handle promise error / success within "it"
  });
});
~~~

## Executing that test

You can invoke kommando either via command-line:

~~~bash
# this will execute your test using PhantomJS (default)
kommando mytest.js
~~~

or via Node.js:

~~~js
// also executing tests using PhantomJS
var kommando = require('kommando');
kommando({
  tests: ['./mytest.js']
});
~~~

Executing test in Chrome, Firefox and PhantomJS using CLI:

~~~bash
kommando -b chrome -b firefox -b phantomjs mytest.js
~~~

or via Node.js:

~~~js
var kommando = require('kommando');
kommando({
  browsers: ['chrome', 'firefox', 'phantomjs'],
  tests: ['./mytest.js']
});
~~~

## Credits

Thanks to [Protractor](https://github.com/angular/protractor) for the initial idea of this project
and its [jasminewd](https://github.com/angular/protractor/tree/master/jasminewd) helper.
