/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat' -> ('eslint', 'csslint', 'boot') -> 'build'
 */
const { src, dest, series, parallel, task } = require('gulp');
const chalk = require('chalk')
const csslint = require('gulp-csslint');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;
const log = require("fancy-log");
const stealTools = require('steal-tools');
const Server = require('karma').Server;

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
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"]
    }

    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
};

/*
 * javascript linter
 */
const esLint = function (cb) {
    var stream = src(["../appl/js/**/*.js"])
        .pipe(eslint({
            configFile: 'eslintConf.json',
            quiet: 1
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
            //Keeping track of # of javascript files linted.
            lintCount++;
        }))
        .pipe(eslint.failAfterError());

    stream.on('error', function () {
        process.exit(1);
    });
    return stream.on('end', function () {
        log("# javascript files linted: " + lintCount);
        cb();
    });
};
/*
 * css linter
 */
const cssLint = function (cb) {
    var stream = src(['../appl/css/site.css'])
        .pipe(csslint())
        .pipe(csslint.formatter());

    stream.on('error', function () {
        process.exit(1);
    });
    return stream.on('end', function () {
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
                    '../images/favicon.ico',
                    '../appl/testapp.html',
                    '../appl/index.html',
                    '../index.html',
                    '../appl/views/**/*',
                    '../appl/assets/**/*',
                    '../appl/templates/**/*',
                    '../../README.md',
                    // '../../node_modules/bootstrap/dist/css/bootstrap.min.css',
                    // '../appl/css/site.css',
                    // '../../node_modules/tablesorter/dist/css/theme.blue.min.css',
                    // '../../node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css',
                    // '../../node_modules/font-awesome/css/font-awesome.css',
                    // '../../node_modules/font-awesome/fonts/*'
                ]
            },
            bundleSteal: false,
            dest: "dist",
            removeDevelopmentCode: true,
            minify: true,
            maxBundleRequests: 5,
            maxMainRequests: 5
        }).then(function () {
            cb()
        });
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
    exec('npx gulp --gulpfile Gulpboot.js', function (err, stdout, stderr) {
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
    runKarma(done, true, false);
};
/**
 * Run karma/jasmine tests using ChromeHeadless 
 */
const steal_chrome = function (done) {
    global.whichBrowsers = ["ChromeHeadless"];
    runKarma(done, true, false);
};
/**
 * Run karma/jasmine tests once and exit
 */
const steal_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    return runKarma(done, true, false);
};
/**
 * Continuous testing - test driven development.  
 */
const steal_tdd = function (done) {
    if (!browsers) {
        global.whichBrowsers = ['Firefox', 'Chrome'];
    }
    return runKarma(done, false, true);
};
/*
 * Startup live reload monitor. 
 */
const live_reload = function (cb) {
    var osCommands = 'cd ../..; npx steal-tools live-reload'; // node_modules/.bin/steal-tools live-reload';
    if (isWindows) {
        osCommands = 'cd ..\\.. & .\\node_modules\\.bin\\steal-tools live-reload'
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
    log.warn(chalk.cyan("Express started"))
    return exec('npm run server', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};

const runLint = parallel(esLint, cssLint, bootLint)

exports.default = series(pat, runLint, build)
exports.prod = series(pat, runLint, build)
exports.prd = build
exports.test = steal_test
exports.tdd = steal_tdd
exports.firefox = steal_firefox
exports.chrome = steal_chrome
exports.hmr = series(vendor, live_reload)
exports.server = web_server
exports.development = parallel(series(vendor, live_reload), web_server, steal_tdd)

function runKarma(done, singleRun, watch) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: singleRun,
        watch: typeof watch === "undefined" || !watch ? false : true
    }, result => {
        var exitCode = !result ? 0 : result;
        if (typeof done === "function") {
            done();
        }
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
}

//From Stack Overflow - Node (Gulp) process.stdout.write to file
if (process.env.USE_LOGFILE == 'true') {
    var fs = require('fs');
    var proc = require('process');
    var origstdout = process.stdout.write,
        origstderr = process.stderr.write,
        outfile = 'production_build.log',
        errfile = 'production_error.log';

    if (fs.exists(outfile)) {
        fs.unlink(outfile);
    }
    if (fs.exists(errfile)) {
        fs.unlink(errfile);
    }

    process.stdout.write = function (chunk) {
        fs.appendFile(outfile, chunk.replace(/\x1b\[[0-9;]*m/g, ''));
        origstdout.apply(this, arguments);
    };

    process.stderr.write = function (chunk) {
        fs.appendFile(errfile, chunk.replace(/\x1b\[[0-9;]*m/g, ''));
        origstderr.apply(this, arguments);
    };
}
