/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat' -> ('eslint', 'csslint', 'boot') -> 'build'
 */
const { src, /* dest, */ series, parallel, /* task */ } = require("gulp");
const chalk = require("chalk");
const csslint = require("gulp-csslint");
const eslint = require("gulp-eslint");
const exec = require("child_process").exec;
const log = require("fancy-log");
const stealTools = require("steal-tools");
const karma = require("karma");
const path = require("path");

let lintCount = 0;
let browsers = process.env.USE_BROWSERS;
if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
let isWindows = /^win/.test(process.platform);
/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }

    karmaServer(done, true, false);
};

/*
 * javascript linter
 */
const esLint = function (cb) {
    var stream = src(["../appl/**/*.js", "../appl/**/*.vue"])
        .pipe(eslint({
            configFile: "../../../.eslintrc.js", // 'eslintConf.json',
            quiet: 1
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
            //Keeping track of # of javascript files linted.
            lintCount++;
        }))
        .pipe(eslint.failAfterError());

    stream.on("error", function () {
        process.exit(1);
    });
    return stream.on("end", function () {
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

    stream.on("error", function () {
        process.exit(1);
    });
    return stream.on("end", function () {
        cb();
    });
};
/*
 * Build the application to the production distribution 
 */
const build = function (cb) {
    return stealTools.build({
        configMain: "package.json!npm",
        main: "stealjs/appl/main",
        baseURL: "../../"
    }, {
        sourceMaps: false,
        bundleAssets: {
            infer: true,
            glob: [
                "../images/*",
                "../appl/testapp.html",
                "../appl/index.html",
                "../index.html",
                "../appl/views/**/*",
                "../appl/dodex/**/*",
                "../appl/assets/**/*",
                "../appl/templates/**/*",
                "../../README.md",
            ]
        },
        bundleSteal: false,
        dest: "dist",
        removeDevelopmentCode: true,
        minify: true,
        debug: true,
        maxBundleRequests: 5,
        maxMainRequests: 5,
        uglifyOptions: {
            mangle: false // mangle breaks bundle
        }
    }).then(function () {
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    exec("npx gulp --gulpfile Gulpboot.js", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/**
 * Run karma/jasmine tests using FirefoxHeadless 
 */
const steal_firefox = function (done) {
    global.whichBrowsers = ["FirefoxHeadless"];
    karmaServer(done, true, false);
};
/**
 * Run karma/jasmine tests using ChromeHeadless 
 */
const steal_chrome = function (done) {
    global.whichBrowsers = ["ChromeHeadless"];
    karmaServer(done, true, false);
};
/**
 * Run karma/jasmine tests once and exit
 */
const steal_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    return karmaServer(done, true, false);
};
/**
 * Continuous testing - test driven development.  
 */
const steal_tdd = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Firefox", "Chrome"];
    }
    return karmaServer(done, false, true);
};
/*
 * Startup live reload monitor. 
 */
const live_reload = function (cb) {
    var osCommands = "cd ../..; npx steal-tools live-reload"; // node_modules/.bin/steal-tools live-reload';
    if (isWindows) {
        osCommands = "cd ..\\.. & .\\node_modules\\.bin\\steal-tools live-reload";
    }

    return exec(osCommands, function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/*
 * Build a vendor bundle from package.json
 */
const vendor = function (cb) {
    let vendorBuild = process.env.USE_VENDOR_BUILD;

    if (vendorBuild && vendorBuild == "false") {
        cb();
        return;
    }

    stealTools.bundle({
        config: "../../package.json!npm"
    }, {
        filter: ["node_modules/**/*", "package.json"],
        //dest: __dirname + "/../dist_test"
    }).then(() => {
        cb();
    });
};
/*
 * Startup live reload monitor. 
 */
const web_server = function (cb) {
    log.warn(chalk.cyan("Express started"));
    return exec("npm run server", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};

const runLint = parallel(esLint, cssLint, bootLint);

exports.default = series(steal_test, runLint, build);
exports.prod = series(steal_test, runLint, build);
exports.prd = build;
exports.test = steal_test;
exports.tdd = steal_tdd;
exports.firefox = steal_firefox;
exports.chrome = steal_chrome;
exports.hmr = series(vendor, live_reload);
exports.server = web_server;
exports.development = parallel(series(vendor, live_reload), web_server, steal_tdd);
exports.lint = parallel(esLint, cssLint, bootLint);

function karmaServer(done, singleRun = false, watch = true) {
    const parseConfig = karma.config.parseConfig;
    const Server = karma.Server;

    parseConfig(
        path.resolve("./karma.conf.js"),
        { port: 9876, singleRun: singleRun, watch: watch },
        { promiseConfig: true, throwErrors: true },
    ).then(
        (karmaConfig) => {
            if(!singleRun) {
                done();
            }
            new Server(karmaConfig, function doneCallback(exitCode) {
                console.log("Karma has exited with " + exitCode);
                if(singleRun) {
                    done();
                }
                if(exitCode > 0) {
                    process.exit(exitCode);
                }
            }).start();
        },
        (rejectReason) => { console.err(rejectReason); }
    );
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
