// more info about reflect-metadata
// https://www.npmjs.com/package/reflect-metadata
require('reflect-metadata');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var today = new Date(),
    timeStamp = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear() + '-' + today.getHours() + today.getMinutes();

var reporter = new HtmlScreenshotReporter({
    dest: './coverage/e2e', // a location to store screen shots.
    filename: 'protractor-demo-tests-report-' + timeStamp + '.html'
});

exports.config = {
    
    baseUrl: 'http://localhost:9001/',
    //seleniumServerJar : './../node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar',
    // 'chrome', 'firefox', 'IE', 'safari', 'phantomjs'
    // More info: http://angular.github.io/protractor/#/browser-setup
    capabilities: {
        'browserName': 'chrome',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: 'Protractor Tests'
    },

    directConnect: true,

    allScriptsTimeout: 110000,
    getPageTimeout: 100000,

    framework: 'jasmine2',
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },


   // Setup the report before any tests start
   beforeLaunch: function() {
      return new Promise(function(resolve){
        reporter.beforeLaunch(resolve);
      });
   },

   // Assign the test reporter to each running instance
   onPrepare: function() {
      jasmine.getEnv().addReporter(reporter);
   },

   // Close the report after all tests finish
   afterLaunch: function(exitCode) {
      return new Promise(function(resolve){
        reporter.afterLaunch(resolve.bind(this, exitCode));
      });
   },
    // Special option for Angular2, to test against all Angular2 applications
    // on the page. This means that Protractor will wait for every app to be
    // stable before each action, and search within all apps when finding
    // elements.
    useAllAngular2AppRoots: true,

    //sauceUser: process.env.SAUCE_USERNAME,
    //sauceKey: process.env.SAUCE_ACCESS_KEY
    //onPrepare: function () {
    //    browser.driver.get('http://localhost:8081/index.html');


    //    // Login takes some time, so wait until it's done.
    //    // For the test app's login, we know it's done when it redirects to
    //    // index.html.
    //    return browser.driver.wait(function () {
    //        //return browser.driver.getCurrentUrl().then(function (url) {
    //        //    return /index2/.test(url);
    //        //});
    //    }, 10000);
    //}
};