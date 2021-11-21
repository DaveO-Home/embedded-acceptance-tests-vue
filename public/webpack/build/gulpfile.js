/**
 * Production build using karma/jasmine acceptance test approval and Development environment with Webpack
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat' -> test-build -> acceptance-tests -> ('csslint', 'bootlint') -> 'build(eslint)'
 */
const { src, /* dest, */ series, parallel, task } = require("gulp");
const env = require("gulp-env");
const log = require("fancy-log");
const rmf = require("rimraf");
const exec = require("child_process").exec;
const path = require("path");
const chalk = require("chalk");
const config = require("../config");
const karma = require("karma");
const eslint = require("gulp-eslint");
const csslint = require("gulp-csslint");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "3080";

let webpackConfig = null;
let browsers = process.env.USE_BROWSERS;
let lintCount = 0;

if (browsers) {
    global.whichBrowsers = browsers.split(",");
}

/*
 * javascript linter
 */
const esLint = function (cb) {
    var stream = src(["../appl/**/*.js", "../appl/**/*.vue", "../tests/*.js"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js",
            quiet: 0,
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.result(() => {
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

    return stream.on("error", function (err) {
        log(err);
        process.exit(1);
    }).on("end", function () {
        cb();
    });
};
/*
 * Build the application to the production distribution 
 */
const build = function (cb) {
    process.env.NODE_ENV = "development";
    process.env.USE_WATCH = "false";
    process.env.USE_KARMA = "false";
    process.env.USE_HMR = "false";
    process.env.PUBLIC_PATH = "";
    process.env.USE_TEST = "true";
    process.env.USE_BUILD = "false";

    rmf("../../dist/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });

    const webpackConfig = webpack(require("./webpack.prod.conf"), (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            cb();
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        } else {
            if (stats.hasWarnings()) {
                console.warn(info.warnings);
            }

            process.stdout.write(stats.toString(
                webpackConfig.options.stats
            ) + "\n");
        }
        cb();
    });
};
/*
 * Bootstrap html linter 
 */
const bootLint = (cb) => {
    log("Starting Gulpboot.js");
    return exec("npx gulp --gulpfile Gulpboot.js", function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
};
/**
 * Run karma/jasmine tests once and exit
 * Set environment variable USE_BUILD=false to bypass the build
 */
const acceptance_tests = function (done) {
    karmaServer(done, true, false);
};
/**
 * Run karma/jasmine tests once and exit
 */
const jasmine_tests = function (done) {
    karmaServer(done, true, false);
};

const test_env = function () {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "true",
        USE_HMR: "false",
        USE_BUILD: false,
        PUBLIC_PATH: "/base/dist_test/webpack/"   //This sets config to run under Karma
    });

    return src("../appl/main.js")
        .pipe(envs);
};
/*
 * Build Test without Karma settings for npm Express server (npm start)
 */
const webpack_rebuild = function (cb) {
    process.env.NODE_ENV = "development";
    process.env.USE_WATCH = "false";
    process.env.USE_KARMA = "false";
    process.env.USE_HMR = "false";
    process.env.PUBLIC_PATH = "";
    process.env.USE_TEST = "true";
    process.env.USE_BUILD = "false";

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });

    const webpackConfig = webpack(require("./webpack.dev.conf"), (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            cb();
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }

        process.stdout.write(stats.toString(
            webpackConfig.options.stats
        ) + "\n");
        cb();
    });
};
/*
 * Build the test bundle
 */
const test_build = function (cb) {
    var useBuild = process.env.USE_BUILD === "false" ? "false" : "true";
    process.env.NODE_ENV = "development";
    process.env.USE_WATCH = "false";
    process.env.USE_KARMA = "true";
    process.env.USE_HMR = "false";
    process.env.PUBLIC_PATH = "/base/dist_test/webpack/"   //This sets config to run under Karma;
    process.env.USE_TEST = "true";
    process.env.USE_BUILD = useBuild;
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "true",
        USE_HMR: "false",
        USE_BUILD: useBuild,
        PUBLIC_PATH: "/base/dist_test/webpack/"   //This sets config to run under Karma
    });

    if (process.env.USE_BUILD == "false") {  //Let Webpack do the build if only doing unit-tests
        return src("../appl/main.js")
            .pipe(envs);
    }

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });

    const webpackConfig = webpack(require("./webpack.dev.conf"), (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            cb();
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }

        process.stdout.write(stats.toString(
            webpackConfig.options.stats
        ) + "\n");
        cb();
    });
};
/**
 * Continuous testing - test driven development.  
 */
const webpack_tdd = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Chrome", "Firefox"];
    }

    karmaServer(done, false, true);
};
/*
 * Webpack recompile to 'dist_test' on code change
 * run watch in separate window. Used with karma tdd.
 */
const webpack_watch = function (cb) {
    process.env.NODE_ENV = "development";
    process.env.USE_WATCH = "true";
    process.env.USE_KARMA = "false";
    process.env.USE_HMR = "false";
    process.env.PUBLIC_PATH = "/base/dist_test/webpack/"   //This sets config to run under Karma;

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });

    webpack(require("./webpack.dev.conf"), (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            cb();
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }

        log(stats.toString({
            colors: true,
            warnings: false,
            assets: false,
            cached: false,
            modules: false
        }));
        // cb();
        log(chalk.blue.bold("Watching for changes"));
    });
};
/*
 * Webpack development server - use with normal development
 * Rebuilds bundles in dist_test on code change.
 * Run server in separate window - 
 * - watch for code changes 
 * - hot module recompile/replace
 * - reload served web page.
 */
const webpack_server = function (cb) {
    env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "true"
    });

    webpackConfig = require("./webpack.dev.conf.js");
    webpackConfig.devtool = "eval";
    webpackConfig.output.path = path.resolve(config.dev.assetsRoot);
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        filename: "testapp_dev.html",
        template: "appl/testapp_dev.html",
        // alwaysWriteToDisk: true,
        inject: true
    }));

    webpackConfig.entry = getEntry();
    const compiler = webpack(webpackConfig);
    const devServerOptions = { ...webpackConfig.devServer, open: false};
    const server = new WebpackDevServer(devServerOptions, compiler);
    server.startCallback(() => {
        log(chalk.blue(`\nSuccessfully started server on http://localhost:${PORT}`));
        cb();
      });
};

const lintRun = parallel(esLint, cssLint, bootLint);
const prodRun = series(test_build, acceptance_tests, lintRun, build);
prodRun.displayName = "prod";

task(prodRun);
exports.default = prodRun;
exports.prd = series(lintRun, build);
exports.test = series(test_build, acceptance_tests);
exports.tdd = series(test_build, webpack_tdd);
exports.rebuild = webpack_rebuild;
exports.acceptance = series(test_env, jasmine_tests);
exports.watch = webpack_watch;
exports.hmr = webpack_server;
exports.development = parallel(webpack_watch, webpack_server, webpack_tdd);
exports.lint = lintRun;

function karmaServer(done, singleRun = false, watch = true) {
    const parseConfig = karma.config.parseConfig;
    const Server = karma.Server;
    
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }

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

//From Stack Overflow - Node (Gulp) process.stdout.write to file
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
/*
 * Taking a snapshot example - puppeteer - Not installed!
 */
function karmaServerSnap(done) {
    const parseConfig = karma.config.parseConfig;
    const Server = karma.Server;
    
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }

    parseConfig(
        path.resolve("./karma.conf.js"),
        { port: 9876, singleRun: true, watch: false },
        { promiseConfig: true, throwErrors: true },
    ).then(
        (karmaConfig) => {
            new Server(karmaConfig, function doneCallback(result) {
                var exitCode = !result ? 0 : result;
                done();
                if (exitCode > 0) {
                    takeSnapShot(["", "start"]);
                    takeSnapShot(["contact", "contact"]);
                    takeSnapShot(["welcome", "vue"]);
                    takeSnapShot(["tabletools", "tools"]);
                    // Not working with PDF-?
                    // takeSnapShot(['pdftest', 'test'])       
                    process.exit(exitCode);
                }
            }).start();
        },
        (rejectReason) => { console.err(rejectReason); }
    );
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true,
        watch: false
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            takeSnapShot(["", "start"]);
            takeSnapShot(["contact", "contact"]);
            takeSnapShot(["welcome", "vue"]);
            takeSnapShot(["tabletools", "tools"]);
            // Not working with PDF-?
            // takeSnapShot(['pdftest', 'test'])       
            process.exit(exitCode);
        }
    }).start();
}

function snap(url, puppeteer, snapshot) {
    puppeteer.launch().then((browser) => {
        log("SnapShot URL", `${url}${snapshot[0]}`);
        let name = snapshot[1];
        let page = browser.newPage().then((page) => {
            page.goto(`${url}${snapshot[0]}`).then(() => {
                page.screenshot({ path: `snapshots/${name}Acceptance.png` }).then(() => {
                    browser.close();
                }).catch((rejected) => {
                    log(rejected);
                });
            }).catch((rejected) => {
                log(rejected);
            });
        }).catch((rejected) => {
            log(rejected);
        });
    }).catch((rejected) => {
        log(rejected);
    });
}

function takeSnapShot(snapshot) {
    const puppeteer = require("puppeteer");
    let url = "http://localhost:3080/dist_test/webpack/appl/testapp_dev.html#/";

    snap(url, puppeteer, snapshot);
}

function getEntry() {
    return [
        // Runtime code for hot module replacement
        "webpack/hot/dev-server.js",
        // Dev server client for web socket transport, hot and live reload logic
        "webpack-dev-server/client/index.js?hot=true&live-reload=true",
        // Your entry
        "/appl/main",
    ];
}