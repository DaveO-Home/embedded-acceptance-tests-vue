/**
 * Production build using karma/jasmine acceptance test approval and Development environment with Webpack
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat' -> test-build -> acceptance-tests -> ('csslint', 'bootlint') -> 'build(eslint)'
 */
const { src, dest, series, parallel, task } = require("gulp");
const env = require("gulp-env");
const log = require("fancy-log");
const rmf = require("rimraf");
const exec = require("child_process").exec;
const execSync = require("child_process").execSync;
const path = require("path");
const chalk = require("chalk");
const config = require("../config");
const Server = require("karma").Server;
const eslint = require("gulp-eslint");
const csslint = require("gulp-csslint");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const pkg = require("../../package.json");
const webpackVersion = Number(/\d/.exec(pkg.devDependencies.webpack)[0]);
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT && Number(process.env.PORT);
const isWindows = /^win/.test(process.platform);

let webpackConfig = null;
let service = process.VUE_CLI_SERVICE;
let browsers = process.env.USE_BROWSERS;
let lintCount = 0;

const getService = () => {
    if (webpackVersion === 4 && (!service || process.env.VUE_CLI_API_MODE)) {
        const Service = require("./cli-service/lib/Service");
        service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd());
        service.init(process.env.VUE_CLI_MODE || process.env.NODE_ENV);
        webpackConfig = service.resolveWebpackConfig();
    }
    return webpackConfig;
};

if (browsers) {
    global.whichBrowser = browsers.split(",");
}

/**
 * Default: Production Acceptance Tests 
 */
// gulp.task('pat', ["acceptance-tests"], function (done) {
const pat = function (done) {
    done();
};
/*
 * javascript linter
 */
const esLint = function (cb) {
    var stream = src(["../appl/**/*.js", "../appl/**/*.vue", "../tests/*.js"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js", // 'eslintConf.json',
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
    const envn = isWindows ? "set NODE_ENV=production & " : "export NODE_ENV=production; ";
    execSync(webpackVersion === 4 ? envn + "node vue-cli-service.js build" : "node build", { stdio: "inherit" });
    return cb();
};
/*
 * Bootstrap html linter 
 */
const bootLint = function (cb) {
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
// gulp.task('acceptance-tests', ['test-build'], function (done) {
const acceptance_tests = function (done) {
    karmaServer(done);
};
/**
 * Run karma/jasmine tests once and exit
 */
// gulp.task('jasmine-tests', ['test-env'], function (done) {
const jasmine_tests = function (done) {
    karmaServer(done);
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
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "",
        USE_TEST: "true",
        USE_BUILD: "false"
    });

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });
    return src("../appl/main.js")
        .pipe(envs)
        .pipe(webpackStream(webpackVersion === 4 ? getService() : require("./webpack.dev.conf.js")))
        .pipe(envs.reset)
        .pipe(dest("../../dist_test/webpack"))
        .on("end", function () {
            cb();
        });
};
/*
 * Build the test bundle
 */
const test_build = function (cb) {
    var useBuild = process.env.USE_BUILD === "false" ? "false" : "true";
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
    return src("../appl/main.js")
        .pipe(envs)
        .pipe(webpackStream(webpackVersion === 4 ? getService() : require("./webpack.dev.conf.js")))
        .pipe(envs.reset)
        .pipe(dest("../../dist_test/webpack"))
        .on("end", function () {
            cb();
        });
};
/**
 * Continuous testing - test driven development.  
 */
// gulp.task('webpack-tdd', ["test-build"], function (done) {
const webpack_tdd = function (done) {
    if (!browsers) {
        global.whichBrowser = ["Chrome", "Firefox"];
    }

    new Server({
        configFile: __dirname + "/karma.conf.js"
    }, done).start();
};
/*
 * Webpack recompile to 'dist_test' on code change
 * run watch in separate window. Used with karma tdd.
 */
const webpack_watch = function (cb) {
    let envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "/base/dist_test/webpack/"
    });

    rmf("../../dist_test/webpack", [], (err) => {
        if (err) {
            log(err);
        }
    });
    return src("../appl/**/*")
        .pipe(envs)
        .pipe(webpackStream(webpackVersion === 4 ? getService() : require("./webpack.dev.conf.js")))
        .pipe(dest("../../dist_test/webpack"))
        .on("end", function () {
            cb();
        });

};

const set_watch_env = function (cb) {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "/base/dist_test/webpack/"
    });

    return src("./appl/index.js")
        .pipe(envs)
        .on("end", function () {
            cb();
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

    const options = {
        contentBase: "../../",
        hot: true,
        host: "localhost",
        publicPath: config.dev.assetsPublicPath,
        stats: { colors: true },
        watchOptions: {
            ignored: /node_modules/,
            poll: config.dev.poll
        },
        quiet: false
    };

    webpackConfig = webpackVersion === 4 ? getService() : require("./webpack.dev.conf.js"); // require('./webpack.dev.conf.js');
    webpackConfig.devtool = "eval";
    webpackConfig.output.path = path.resolve(config.dev.assetsRoot);
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NamedModulesPlugin()); // HMR shows correct file names in console on update.
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        filename: "testapp_dev.html",
        template: webpackVersion === 4 ? "../appl/testapp_dev.html" : "appl/testapp_dev.html",
        inject: true
    }));

    WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, options);

    server.listen(PORT || config.dev.port, HOST /*|| webpackConfig.devServer.host*/, function (err) {
        log("[webpack-server]", `http://${/*webpackConfig.devServer.host*/ HOST}:${PORT || config.dev.port}/webpack/appl/testapp_dev.html`);
        if (err) {
            log(err);
        }
        cb();
    });
};

const lintRun = parallel(esLint, cssLint, bootLint);
const prodRun = series(test_build, acceptance_tests, lintRun, build);
prodRun.displayName = "prod";

task(prodRun);
exports.default = prodRun;
exports.prd = build;
exports.test = series(test_build, acceptance_tests);
exports.tdd = series(test_build, webpack_tdd);
exports.rebuild = webpack_rebuild;
exports.acceptance = series(test_env, jasmine_tests);
exports.watch = webpack_watch;
exports.hmr = webpack_server;
exports.development = parallel(webpack_watch, webpack_server, webpack_tdd);
exports.lint = lintRun;

function karmaServer(done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true,
        watch: false
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
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
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
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
            takeSnapShot(["table/tools", "tools"]);
            // Not working with PDF-?
            // takeSnapShot(['pdf/test', 'test'])       
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
