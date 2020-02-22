/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(run acceptance tests) -> 'build-development' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */

const { src, dest, series, parallel, task} = require("gulp");
const Server = require("karma").Server;
const eslint = require("gulp-eslint");
const csslint = require("gulp-csslint");
const exec = require("child_process").exec;
const copy = require("gulp-copy");
const stripCode = require("gulp-strip-code");
const del = require("del");
const noop = require("gulp-noop");
const log = require("fancy-log");
const Bundler = require("parcel-bundler");
const flatten = require("gulp-flatten");
const chalk = require("chalk");
const browserSync = require("browser-sync");

const startComment = "develblock:start",
    endComment = "develblock:end",
    regexPattern = new RegExp("[\\t ]*(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        startComment + " ?[\\*\\/]?[\\s\\S]*?(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        endComment + " ?(\\*\\/)?[\\t ]*\\n?", "g");

let lintCount = 0;
let isProduction = process.env.NODE_ENV == "production";
let browsers = process.env.USE_BROWSERS;
let bundleTest = process.env.USE_BUNDLER;
let testDist = "dist_test/parcel";
let prodDist = "dist/parcel";
let dist = isProduction ? prodDist : testDist;

if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
/**
 * Build Development bundle from package.json 
 */
const build_development = function (cb) {
    return parcelBuild(false, cb); // setting watch = false
};
/**
 * Production Parcel 
 */
const build = function (cb) {
    process.env.NODE_ENV = "production";
    isProduction = true;
    parcelBuild(false, cb).then(function () {
        cb();
    });
};
/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    return runKarma(done);
};
/*
 * javascript linter
 */
const esLint = function (cb) {
    dist = prodDist;
    var stream = src(["../appl/**/*.js", "../appl/**/*.vue"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js", // 'eslintConf.json',
            quiet: 0
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
            //Keeping track of # of javascript files linted.
            lintCount++;
        }))
        .pipe(eslint.failAfterError());

    stream.on("error", () => {
        process.exit(1);
    });

    return stream.on("end", () => {
        log(chalk.blue.bold("# js & vue files linted: " + lintCount));
        cb();
    });
};
/*
 * css linter
 */
const cssLint = function (cb) {
    var stream = src(["../appl/css/site.css"])
        .pipe(csslint())
        .pipe(csslint.formatter());

    stream.on("error", () => {
        process.exit(1);
    });
    return stream.on("end", () => {
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    return exec("npx gulp --gulpfile Gulpboot.js", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/**
 * Remove previous build
 */
const clean = function (done) {
    isProduction = true;
    dist = prodDist;
    return del([
        "../../" + prodDist + "/**/*"
    ], { dryRun: false, force: true }, done);
};

const cleant = function (done) {
    let dryRun = false;
    if (bundleTest && bundleTest === "false") {
        dryRun = true;
    }
    isProduction = false;
    dist = testDist;
    return del([
        "../../" + testDist + "/**/*"
    ], { dryRun: dryRun, force: true }, done);
};
/**
 * Resources and content copied to dist directory - for production
 */
const copyprod = function () {
    return copySrc();
};

const copyprod_images = function () {
    isProduction = true;
    dist = prodDist;
    copyImages2();
    return copyImages();
};
/**
 * Resources and content copied to dist_test directory - for development
 */
const copy_test = function () {
    return copySrc();
};

const copy_images = function () {
    isProduction = false;
    dist = testDist;
    copyImages2();
    return copyImages();
};
/**
 * Run karma/jasmine tests once and exit without rebuilding(requires a previous build)
 */
const r_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    runKarma(done);
};
/**
 * Continuous testing - test driven development.  
 */
// gulp.task('tdd-parcel', ['build-development'], done => {
const tdd_parcel = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Chrome", "Firefox"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
    }, done).start();
};
/**
 * Karma testing under Opera. -- needs configuation  
 */
const tddo = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Opera"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
    }, done).start();
};
/**
 * Using BrowserSync Middleware for HMR  
 */
const sync = function () {
    const server = browserSync.create("devl");
    dist = testDist;
    server.init({ server: "../../", index: "index_p.html", port: 3080/*, browser: ['google-chrome']*/ });
    server.watch("../../" + dist + "/appl.*.*").on("change", server.reload);  //change any file in appl/ to reload app - triggered on watchify results
    return server;
};

const watcher = function (done) {
    log(chalk.green("Watcher & BrowserSync Started - Waiting...."));
    return done();
};

const watch_parcel = function (cb) {
    return parcelBuild(true, cb);
};

const runTestCopy = parallel(copy_test, copy_images);
const runTest = series(cleant, runTestCopy, build_development);
const runProdCopy = parallel(copyprod, copyprod_images);
const runProd = series(runTest, pat, parallel(esLint, cssLint, bootLint), clean, runProdCopy, build);
runProd.displayName = "prod";

task(runProd);
exports.default = runProd;
exports.test = series(runTest, pat);
exports.tdd = series(runTest, tdd_parcel);
exports.watch = series(runTestCopy, watch_parcel, sync, watcher);
exports.acceptance = r_test;
exports.rebuild = series(runTestCopy, runTest);
exports.lint = parallel(esLint, cssLint, bootLint);
exports.copy = runTestCopy;
// exports.development = parallel(series(runTestCopy, watch_parcel, sync, watcher), series(runTestCopy, build_development, tdd_parcel))

function parcelBuild(watch, cb) {
    if (bundleTest && bundleTest === "false") {
        return cb();
    }
    const file = isProduction ? "../appl/testapp.html" : "../appl/testapp_dev.html";
    // Bundler options
    const options = {
        production: isProduction,
        outDir: "../../" + dist,
        outFile: isProduction ? "testapp.html" : "testapp_dev.html",
        publicUrl: "./",
        watch: watch,
        cache: !isProduction,
        cacheDir: ".cache",
        minify: isProduction,
        target: "browser",
        https: false,
        logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
        // hmrPort: 3080,
        sourceMaps: !isProduction,
        // hmrHostname: 'localhost',
        detailedReport: isProduction
    };

    // Initialises a bundler using the entrypoint location and options provided
    const bundler = new Bundler(file, options);
    let isBundled = false;

    bundler.on("bundled", (bundle) => {
        isBundled = true;
    });
    bundler.on("buildEnd", () => {
        if (isBundled) {
            log(chalk.green("Build Successful"));
        }
        else {
            log(chalk.red("Build Failed"));
            process.exit(1);
        }
    });
    // Run the bundler, this returns the main bundle
    return bundler.bundle();
}

function copySrc() {
    return src(["../appl/view*/**/*", "../appl/temp*/**/*",  "../appl/assets/**/*"/*, isProduction ? '../appl/testapp.html' : '../appl/testapp_dev.html'*/])
        .pipe(flatten({ includeParents: -2 })
        .pipe(dest("../../" + dist + "/")));
}

function copyImages() {
    return src(["../images/*", "../../README.m*", "../appl/assets/**/*", "../appl/dodex/**/*"])
        .pipe(copy("../../" + dist + "/appl"));
}
function copyImages2() {
    return src(["../images/*"])
        .pipe(copy("../../" + dist));
}

function runKarma(done) {
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, result => {
        var exitCode = !result ? 0 : result;
        if (typeof done === "function") {
            done();
        }
        if (exitCode > 0) {
            log("You may need to remove the ../parcel/build/.cache directory");
            process.exit(exitCode);
        }
    }).start();
}

// From Stack Overflow - Node (Gulp) process.stdout.write to file
if (process.env.USE_LOGFILE == "true") {
    var fs = require("fs");
    var util = require("util");
    var logFile = fs.createWriteStream("log.txt", { flags: "w" });
    // Or "w" to truncate the file every time the process starts.
    var logStdout = process.stdout;

    // eslint-disable-next-line no-console
    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + "\n");
        logStdout.write(util.format.apply(null, arguments) + "\n");
    };
    // eslint-disable-next-line no-console
    console.error = console.log;
}
