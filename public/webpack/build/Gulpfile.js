/**
 * Production build using karma/jasmine acceptance test approval and Development environment with Webpack
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(test-build, acceptance-tests) -> 'csslint' -> 'boot' -> 'build(eslint)'
 */
const env = require("gulp-env")
const log = require("fancy-log")
const rmf = require('rimraf')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const gulp = require('gulp')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const eslint = require('gulp-eslint')
const Server = require('karma').Server
const csslint = require('gulp-csslint')
const webpack = require('webpack')
const portfinder = require('portfinder')
const webpackStream = require("webpack-stream")
const WebpackDevServer = require('webpack-dev-server')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let webpackConfig = null
let browsers = process.env.USE_BROWSERS

if (browsers) {
    global.whichBrowser = browsers.split(",")
}
/**
 * Default: Production Acceptance Tests 
 */
gulp.task('pat', ["acceptance-tests"], function (done) {
    done();
});
/*
 * css linter
 */
gulp.task('csslint', ['pat'], function () {
    var stream = gulp.src(['../appl/css/site.css'])
        .pipe(csslint())
        .pipe(csslint.formatter());

    stream.on('error', function (err) {
        log(err);
        process.exit(1);
    });
});
/*
 * Build the application to the production distribution 
 */
gulp.task('build', ['boot'], function (cb) {   
    return exec('node build', function (err, stdout, stderr) {
            log(stdout);
            log(stderr);
    
            cb(err);
        })
});
/*
 * Bootstrap html linter 
 */
gulp.task('boot', ['csslint'], function (cb) {
    log("Starting Gulpboot.js")
    return exec('gulp --gulpfile Gulpboot.js', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    });
});
/**
 * Run karma/jasmine tests once and exit
 * Set environment variable USE_BUILD=false to bypass the build
 */
gulp.task('acceptance-tests', ['test-build'], function (done) {
    karmaServer(done);
});
/**
 * Run karma/jasmine tests once and exit
 */
gulp.task('jasmine-tests', ['test-env'], function (done) {
    karmaServer(done);
});

gulp.task("test-env", function () {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "true",
        USE_HMR: "false",
        USE_BUILD: false,
        PUBLIC_PATH: "/base/dist_test/webpack/"   //This sets config to run under Karma
    });

    return gulp.src("../appl/main.js")
        .pipe(envs);
})

/*
 * Build Test without Karma settings for npm Express server (npm start)
 */
gulp.task("webpack-rebuild", function () {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "",
        USE_TEST: "true",
        USE_BUILD: "false"
    });

    rmf('../../dist_test/webpack', [], (err) => {
        if (err) {
            log(err)
        }
    });
    return gulp.src("../appl/main.js")
        .pipe(envs)
        .pipe(webpackStream(require('./webpack.dev.conf.js')))
        .pipe(envs.reset)
        .pipe(gulp.dest("../../dist_test/webpack"));
});
/*
 * Build the test bundle
 */
gulp.task("test-build", function () {
    var useBuild = process.env.USE_BUILD === "false" ? "false" : "true";
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "false",
        USE_KARMA: "true",
        USE_HMR: "false",
        USE_BUILD: useBuild,
        PUBLIC_PATH: "/base/dist_test/webpack/"   //This sets config to run under Karma
    });

    if (process.env.USE_BUILD == 'false') {  //Let Webpack do the build if only doing unit-tests
        return gulp.src("../appl/main.js")
            .pipe(envs);
    }

    rmf('../../dist_test/webpack', [], (err) => {
        if (err) {
            log(err)
        }
    });
    return gulp.src("../appl/main.js")
        .pipe(envs)
        .pipe(webpackStream(require('./webpack.dev.conf.js')))
        .pipe(envs.reset)
        .pipe(gulp.dest("../../dist_test/webpack"));
});
/**
 * Continuous testing - test driven development.  
 */
gulp.task('webpack-tdd', ["test-build"], function (done) {
    if (!browsers) {
        global.whichBrowser = ['Chrome', 'Firefox'];
    }

    new Server({
        configFile: __dirname + '/karma_conf.js'
    }, done).start();
});
/*
 * Webpack recompile to 'dist_test' on code change
 * run watch in separate window. Used with karma tdd.
 */
gulp.task("webpack-watch", function () {
    let envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "/base/dist_test/webpack/"
    });

    rmf('../../dist_test/webpack', [], (err) => {
        if (err) {
            log(err)
        }
    });
    return gulp.src("../appl/**/*")
        .pipe(envs)
        .pipe(webpackStream(require('./webpack.dev.conf.js')))
        .pipe(gulp.dest("../../dist_test/webpack"));

});

gulp.task('set-watch-env', function () {
    var envs = env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "false",
        PUBLIC_PATH: "/base/dist_test/webpack/"
    });

    return gulp.src("./appl/index.js")
        .pipe(envs);
});
/*
 * Webpack development server - use with normal development
 * Rebuilds bundles in dist_test on code change.
 * Run server in separate window - 
 * - watch for code changes 
 * - hot module recompile/replace
 * - reload served web page.
 */
gulp.task("webpack-server", function () {
    env.set({
        NODE_ENV: "development",
        USE_WATCH: "true",
        USE_KARMA: "false",
        USE_HMR: "true"
    });

    const options = {
        contentBase: '../../',
        hot: true,
        host: 'localhost',
        publicPath: config.dev.assetsPublicPath,
        stats: { colors: true },
        watchOptions: {
            ignored: /node_modules/,
            poll: config.dev.poll
        },
        quiet: false
    };

    webpackConfig = require('./webpack.dev.conf.js');
    webpackConfig.devtool = 'eval';
    webpackConfig.output.path = path.resolve(config.dev.assetsRoot);
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NamedModulesPlugin()); // HMR shows correct file names in console on update.
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        filename: 'testapp_dev.html',
        template: 'appl/testapp_dev.html',
        inject: true
    }));

    WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

    // This seems to be not working?
    //    portfinder.basePort = process.env.PORT || config.dev.port;
    //    portfinder.getPort((err, port) => {
    //      if (err) {
    //        reject(err);
    //      } else {
    //        // publish the new Port, necessary for e2e tests
    //        process.env.PORT = port;
    //        // add port to devServer config
    //        webpackConfig.devServer.port = port;
    //        // Add FriendlyErrorsPlugin
    //        webpackConfig.plugins.push(new FriendlyErrorsPlugin({
    //          compilationSuccessInfo: {
    //            messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`]
    //          },
    //          onErrors: config.dev.notifyOnErrors
    //            ? utils.createNotifierCallback()
    //            : undefined
    //        }));
    //      }
    //    });

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, options);

    server.listen(PORT || config.dev.port, webpackConfig.devServer.host, function (err) {
        log('[webpack-server]', `http://${webpackConfig.devServer.host}:${PORT || config.dev.port}/webpack/appl/testapp_dev.html`);
        if (err) {
            log(err);
        }
    });
});

gulp.task('default', ['pat', 'csslint', 'boot', 'build']);
gulp.task('tdd', ['webpack-tdd']);
gulp.task('test', ['acceptance-tests']);
gulp.task('watch', ['webpack-watch']);
gulp.task('hmr', ['webpack-server']);
gulp.task('rebuild', ['webpack-rebuild']);   //removes karma config for node express.
gulp.task('acceptance', ['jasmine-tests']);

function karmaServer(done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
    new Server({
        configFile: __dirname + '/karma_conf.js',
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
if (process.env.USE_LOGFILE == 'true') {
    var fs = require('fs');
    var proc = require('process');
    var origstdout = process.stdout.write,
        origstderr = process.stderr.write,
        outfile = 'node_output.log',
        errfile = 'node_error.log';

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
/*
 * Taking a snapshot example - puppeteer - Not installed!
 */
function karmaServerSnap(done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
    new Server({
        configFile: __dirname + '/karma_conf.js',
        singleRun: true,
        watch: false
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            takeSnapShot(['', 'start'])
            takeSnapShot(['contact', 'contact'])
            takeSnapShot(['welcome', 'vue'])
            takeSnapShot(['table/tools', 'tools'])
            // Not working with PDF-?
            // takeSnapShot(['pdf/test', 'test'])       
            process.exit(exitCode);
        }
    }).start();
}

function snap(url, puppeteer, snapshot) {
    puppeteer.launch().then((browser) => {
        console.log('SnapShot URL', `${url}${snapshot[0]}`)
        let name = snapshot[1]
        let page = browser.newPage().then((page) => {
            page.goto(`${url}${snapshot[0]}`).then(() => {
                page.screenshot({ path: `snapshots/${name}Acceptance.png` }).then(() => {
                    browser.close();
                }).catch((rejected) => {
                    log(rejected)
                })
            }).catch((rejected) => {
                log(rejected)
            })
        }).catch((rejected) => {
            log(rejected)
        })
    }).catch((rejected) => {
        log(rejected)
    })
}

function takeSnapShot(snapshot) {
    const puppeteer = require('puppeteer')
    let url = 'http://localhost:3080/dist_test/webpack/appl/testapp_dev.html#/'

    snap(url, puppeteer, snapshot)
}
