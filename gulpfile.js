/// <binding BeforeBuild='copy.htmlfiles.to.www' />
// 
// Inspiration from https://github.com/ghpabs/angular2-seed-project

'use strict';

var gulp = require('gulp');
var tslint = require('gulp-tslint');
var browserSync = require('browser-sync');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var gulptypescript = require('gulp-typescript');
var karma = require('karma');
var sourceMaps = require('gulp-sourcemaps');
var fs = require('fs');
var webdriver = require('gulp-protractor').webdriver_update;
var history = require('connect-history-api-fallback');
var connect = require('gulp-connect');
var protractor = require('gulp-protractor').protractor;
var httpServer = null;

gulp.task('NPM+NODE.version', function (done) {
    // adding require here so it doesn't run every time the gulpfile.js is loaded and run.
    var checkEnvironment = require('./tools/check-environment.js');
    checkEnvironment({ requiredNpmVersion: '>=2.14.7 <3.0.0', requiredNodeVersion: '>=4.2.1 <5.0.0' }, done);
});

gulp.task('webdriver_update',gulp.series(webdriver));


/**
 * Used before build to copy all the html file from ./scripts to ./www
 */
gulp.task('copy.htmlfiles.to.www', gulp.series(
    copyHTMLToWWW
));

//gulp.task('browser.sync.js-watch', ['js'], browserSync.reload);


// remove the karma folder.
function karmaClean(done) {
    //You can use multiple globbing patterns as you would with `gulp.src`
    //If you are using del 2.0 or above, return its promise
    return del(['.karma'],done);
}



// remove the test folder in scripts.
function unitClean(done) {
    //You can use multiple globbing patterns as you would with `gulp.src`
    //If you are using del 2.0 or above, return its promise
    return del(['www/scripts/tests'],done);
}

function karmaTsSpec() {
    // takes the .ts files and converts to .js
    return karmaTs('scripts/tests/unit');
}

function ts(filesRoot, filesGlob, filesDest, project) {
    var results = gulp.src(filesGlob)
        .pipe(plugins.sourcemaps.init())
		.pipe(plugins.typescript(project))

    return results.js
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(filesDest))
}

function karmaTs(root) {
    var project = plugins.typescript.createProject('./scripts/tsconfig.json', {
        outDir: '.karma'
    });

    var filesRoot = root;
    var filesDest = '.karma';
    var filesGlob = [
		root + '/**/*.ts'
    ];
    return ts(filesRoot, filesGlob, filesDest, project);
}

function convertTSJS() {
    var tsconfigPath = './scripts/tsconfig.json';
    return gulp.src(['./scripts/**/*.ts', '!./scripts/typings/*'])
        .pipe(gulptypescript(gulptypescript.createProject(tsconfigPath)))
        .pipe(gulp.dest("www/scripts"));
}

function copyHTMLToWWW() {
    return gulp.src(['./scripts/**/*.html'])
    .pipe(gulp.dest('./www/scripts/'));
}


function karmaRun(done) {
    new karma.Server({
        configFile: __dirname + '/tools/karma.conf.js'
    }, () => { done();}).start();
}

gulp.task('post.build.cleanup', gulp.series(
    unitClean
));


//remove the protractor folder
function protractorClean(done) {
    return del(['.protractor'],done);
}

// Locate the protractor .ts files, convert to .js and save to .protractor folder
function protractorTs2Js() {
    var protractorTsProject = plugins.typescript.createProject('./scripts/tsconfig.json', {
        outDir: '.protractor'
    });
    var filesRoot = 'scripts/tests/e2e';
    var filesDest = `.protractor/${filesRoot}`;
    var filesGlob = [
		`${filesRoot}/**/*.ts`
    ];

    return ts(filesRoot, filesGlob, filesDest, protractorTsProject);
}

/**
 * Ensures the selenium web drivers are installed
 * Updates selenium standalone
 * Updates chromedriver
 */
function protractorUpdate(done) {
    webdriver({}, done);
}


/**
 * Setup the test
 */
function protractorRun(done) {
    // use return and delete cb
    // Spec patterns are relative to the current working directly when
    //gulp.src('.protractor/scripts/tests/e2e/**/*.spec.js')
    //	.pipe(plugins.protractor.protractor({
    //	    configFile: './tools/protractor.conf.js'
    //	}))
    //	.on('error', e => { throw e })
    //    .on('end', () => close(cb));
    return gulp.src('.protractor/scripts/tests/e2e/**/*.spec.js')
        .pipe(plugins.protractor.protractor({
            configFile: './tools/protractor.conf.js'
        }))
        .on('error', e => {
            plugins.connect.serverClose(); 
            throw e; })
        .on('end', () => {
            plugins.connect.serverClose();
            done();
        });
}

/**
 * copy all www files to .protractor
 */
function copyWWWToProtractor() {
    return gulp.src(['./www/**', '!./www/scripts/tests/**'])
    .pipe(gulp.dest(".protractor/"));
}


/**
 * Steps:
 * Make sure the Connect Server is running
 * Delete the .protractor folder.
 * Convert .ts files to .js and save to .protractor folder.
 * Check to see if selenium web drivers are installed.
 * Run Protractor
 */
gulp.task('e2e.test.protractor', gulp.series(
	protractorClean,
    copyWWWToProtractor,
	protractorTs2Js,
	protractorUpdate,
	protractorRun,
	protractorClean
));


/**
 * Runs a webserver
 * Protractor connects to it.
 * Only needs to run once and keep it running
 */
gulp.task('e2e.server', gulp.series(
	startServer       
));

// Gulp plugin to run a webserver
// Info used in protractor.conf.js
function startServer(done) {
    plugins.connect.server({
        root: '.protractor',
        livereload: false,
        port: 9001,
        middleware: (connect, opt) =>[history()]
    });
    done();
}

// Lint files
gulp.task('lint', function () {
    // Rules can be found here
    // https://github.com/palantir/tslint#supported-rules
    // Microsoft Rules = https://github.com/Microsoft/tslint-microsoft-contrib/blob/master/tslint.json
    var tslintConfig = require('./tools/tslint.json');
    return gulp.src(['scripts/**/*.ts', '!scripts/typings/**'])
        //Custom rules can be added to configuration.  rulesDirectory: 'folder/folder'
      .pipe(tslint({
          configuration: tslintConfig,
          rulesDirectory: 'node_modules/tslint-microsoft-contrib'          
      }))
      .pipe(tslint.report('verbose', { emitError: true, reportLimit: 0 }));

});


// End to end test

gulp.task('e2e',gulp.series(
    gulp.parallel('e2e.server',
    'e2e.test.protractor')
),(done)=> {done();});


// Build
/**
 * This is used by the travis.yml file to compile the .ts files into .js before running the unit test.
 */
gulp.task("build", gulp.series(
    convertTSJS,
    copyHTMLToWWW
),(done)=> {done();});

// Unit Test
gulp.task('unit', gulp.series(
    // Remember take in a callback or return a promise or event stream to avoid gulp 'The following tasks did not complete.'
    //clear the karma folder
    //karmaClean,
    // convert the .ts files to .js and save in karma folder
    //karmaTsSpec,
    // run the karma server
    'build',
    karmaRun,
    'post.build.cleanup'
),(done)=> {done();});

/**
 * Start a small webserver.
 */
gulp.task('startWebServer', function () {
    browserSync.init({
        server: {
            baseDir: "./www/"
        }
    });
},(done)=> {done();});


/**
 * Test Application 
 */
gulp.task('test',gulp.series(
    gulp.parallel('e2e','unit')
),(done)=> {done();});

/**
 * Serve Application
 */
gulp.task('serve',gulp.series(
    'build',
    'post.build.cleanup',
    'startWebServer'
),(done)=> {done();});