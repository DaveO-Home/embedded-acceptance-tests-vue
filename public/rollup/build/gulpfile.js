/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'pat'(run acceptance tests) -> 'build-development' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const { src, dest, series, parallel, task } = require("gulp");
const babel = require("@rollup/plugin-babel").default;
const buble = require("@rollup/plugin-buble");
const copy = require("gulp-copy");
const csslint = require("gulp-csslint");
const eslint = require("gulp-eslint");
const exec = require("child_process").exec;
const livereload = require("rollup-plugin-livereload");
const log = require("fancy-log");

const commonjs = require("@rollup/plugin-commonjs");
const alias = require("@rollup/plugin-alias");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const fs = require("fs");

const noop = require("gulp-noop");
const path = require("path");
const postcss = require("rollup-plugin-postcss");
const progress = require("rollup-plugin-progress");
const rename = require("gulp-rename");
const replaceEnv = require("rollup-plugin-replace");
const rmf = require("rimraf");
const rollup = require("rollup");
const serve = require("rollup-plugin-serve");
const stripCode = require("gulp-strip-code");
const karma = require("karma");
const uglify = require("gulp-uglify");
const vue = require("rollup-plugin-vue");
const image = require("@rollup/plugin-image");
const chalk = require("chalk");
// const sourcemaps = require("gulp-sourcemaps");

const startComment = "develblock:start",
    endComment = "develblock:end",
    regexPattern = new RegExp("[\\t ]*(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        startComment + " ?[\\*\\/]?[\\s\\S]*?(\\/\\* ?|\\/\\/[\\s]*\\![\\s]*)" +
        endComment + " ?(\\*\\/)?[\\t ]*\\n?", "g");

let lintCount = 0;
let isProduction = process.env.NODE_ENV == "production";
let browsers = process.env.USE_BROWSERS;
let testDist = "dist_test/rollup";
let prodDist = "dist/rollup";
let dist = isProduction ? prodDist : testDist;

if (browsers) {
    global.whichBrowsers = browsers.split(",");
}
/**
 * Build Development bundle from package.json 
 */
const build_development = async function (cb) {
    await rollupBuild(cb);
};
/**
 * Production Rollup 
 */
const build = async function (done) {
    await rollupBuild(done);
};
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
    dist = prodDist;
    var stream = src(["../appl/**/*.js", "../appl/**/*.vue"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js", // 'eslintConf.json',
            quiet: 0
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

    stream.on("error", function () {
        process.exit(1);
    });
    return stream.on("end", function () {
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
 * Remove previous build
 */
const clean = function (done) {
    isProduction = true;
    dist = prodDist;
    return rmf(`../../${prodDist}/**/*`, err => {
        done(err);
    });
};
/**
 * Remove previous test build
 */
const cleant = function (done) {
    isProduction = false;
    dist = testDist;
    return rmf(`../../${dist}/**/*`, err => {
        done(err);
    });
};
/**
 * Resources and content copied to dist directory - for production
 */
const copyprod = function () {
    isProduction = true;
    dist = prodDist;
    copyIndex();
    return copySrc();
};

const copyprod_images = function () {
    return copyImages();
};

// const copyprod_node_css = function () {
//     return copyNodeCss();
// };

const copyprod_css = function () {
    return copyCss();
};

// const copyprod_fonts = function () {
//     isProduction = true;
//     dist = prodDist;
//     copyFonts2();
//     return copyFonts();
// };
/**
 * Resources and content copied to dist_test directory - for development
 */
const copy_test = function () {
    isProduction = false;
    dist = testDist;
    return copySrc();
};

const copy_images = function () {
    copyIndex();
    return copyImages();
};

// const copy_node_css = function () {
//     return copyNodeCss();
// };

const copy_css = function () {
    return copyCss();
};

// const copy_fonts = function () {
//     isProduction = false;
//     dist = testDist;
//     copyFonts2();
//     return copyFonts();
// };
/**
 * Run karma/jasmine tests once and exit without rebuilding(requires a previous build)
 */
const r_test = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["ChromeHeadless", "FirefoxHeadless"];
    }
    karmaServer(done, true, false);
};
/**
 * Continuous testing - test driven development.  
 */
const rollup_tdd = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Chrome", "Firefox"];
    }
    karmaServer(done, false, true);
};
/**
 * Karma testing under Opera. -- needs configuation  
 */
const tddo = function (done) {
    if (!browsers) {
        global.whichBrowsers = ["Opera"];
    }
    karmaServer(done, false, true);
};

const rollup_watch = function (cb) {
    const watchOptions = {
        // allowRealFiles: true,
        input: "../appl/main.js",
        plugins: [
            progress({
                clearLine: isProduction ? false : true
            }),
            replaceEnv({
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
                "process.env.VUE_ENV": JSON.stringify("browser"),
                __VUE_PROD_DEVTOOLS__: false,
                __VUE_OPTIONS_API__: true
            }),
            alias(aliases()),
            vue(),
            nodeResolve(
            //     {
            //     browser: true,
            //     jsnext: true,
            //     main: true,
            //     extensions: [".js", ".json"]
            // }
            ),
            commonjs(),
            postcss(),
            image({
                extensions: /\.(png|jpg|jpeg|gif|svg)$/, // support png|jpg|jpeg|gif|svg, and it's alse the default value
                limit: 8192,  // default 8192(8k)
                exclude: "node_modules/**"
            }),
            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        { modules: false }
                    ],
                    "babel-preset-vue",
                ],
                babelHelpers: "bundled"
            }),
            buble(),

            serve({
                open: false,
                verbose: true,
                contentBase: "../../",
                historyApiFallback: false,
                host: "localhost",
                port: 3080
            }),
            livereload({
                watch: "../../" + dist + "/bundle.js",
                verbose: true,
            })
        ],
        output: {
            name: "acceptance",
            file: "../../" + dist + "/bundle.js",
            format: "iife",
            sourcemap: true
        }
    };
    const watcher = rollup.watch(watchOptions);
    let starting = false;
    watcher.on("event", event => {
        switch (event.code) {
            case "START":
                log("Starting...");
                starting = true;
                break;
            case "BUNDLE_START":
                log(event.code, "\nInput=", event.input, "\nOutput=", event.output);
                break;
            case "BUNDLE_END":
                log("Waiting for code change. Build Time:", millisToMinutesAndSeconds(event.duration));
                break;
            case "END":
                if (!starting)
                    log("Watch Shutdown Normally");
                cb();
                starting = false;
                break;
            case "ERROR":
                log("Unexpected Error", event);
                cb();
                break;
            case "FATAL":
                log("Rollup Watch interrupted by Fatal Error", event);
                cb();
                break;
            default:
                cb();
                break;
        }
    });
};

const testCopyRun = series(copy_test, parallel(copy_images, /*copy_node_css,*/ copy_css));
const testRun = series(cleant, testCopyRun, build_development);
const lintRun = parallel(esLint, cssLint, bootLint);
const prodCopyRun = series(copyprod, parallel(copyprod_images, /*copyprod_node_css,*/ copyprod_css));
const prodRun = series(cleant, testCopyRun, build_development, pat, lintRun, clean, prodCopyRun, build);
prodRun.displayName = "prod";

task(prodRun);
exports.default = prodRun;
exports.prd = series(clean, prodCopyRun, build);
exports.test = series(testRun, pat);
exports.tdd = series(testRun, rollup_tdd);
exports.watch = rollup_watch;
exports.rebuild = testRun;
exports.acceptance = r_test;
exports.development = parallel(rollup_watch, rollup_tdd);
exports.lint = parallel(esLint, cssLint, bootLint);
exports.copy = testCopyRun;

async function rollupBuild(cb) {
    await rollup.rollup({
        input: "../appl/main.js",
        treeshake: isProduction,
        perf: isProduction,
        plugins: [
            replaceEnv({
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
                "process.env.VUE_ENV": JSON.stringify("browser"),
                __VUE_PROD_DEVTOOLS__: false,
                __VUE_OPTIONS_API__: true
            }),
            alias(aliases()),
            vue(),
            nodeResolve(),
            commonjs(),
            postcss({ minimize: true }),
            progress({
                clearLine: true
            }),
            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        { modules: false }
                    ],
                    "babel-preset-vue",
                ],
                babelHelpers: "bundled"
            }),
            buble({ modules: false }),
            image({
                extensions: /\.(png|jpg|jpeg|gif|svg)$/,
                limit: 8192,  // default 8192(8k)
                exclude: "node_modules/**"
            })
        ],
        onwarn: function (warning) {
            if (warning.code === "THIS_IS_UNDEFINED" ||
                warning.code === "CIRCULAR_DEPENDENCY") {
                return;
            }
            console.warn(warning.message);
        }
    }).then(async bundle => {
        await bundle.write({
            file: `../../${dist}/bundle_temp.js`,
            format: "iife",
            name: "bundle_temp",
            sourcemap: isProduction === false,
        }).then(async () => {
            src([`../../${dist}/bundle_temp.js`])
                // .pipe(removeCode({ production: isProduction }))
                .pipe(isProduction ? stripCode({ pattern: regexPattern }) : noop())
                .pipe(isProduction ? uglify() : noop())
                .pipe(rename("bundle.js"))
                .pipe(dest(`../../${dist}`))
                .on("error", log)
                .on("end", function () {
                    rmf(`../../${dist}/bundle_temp.js`, err => {
                        cb(err);
                    });
                });
        });
    });
    return new Promise((resolve, reject) => {
        checkFile(resolve, reject);
    }).then((resolved) => {
        log(chalk.green.bold(resolved));
        cb();
    }).catch(rejected => {
        log(chalk.red.bold(`Failed: ${rejected}`));
        cb();
        process.exit(1);
    });
}

function modResolve(dir) {
    return path.join(__dirname, "..", dir);
}

let count = 0;
function checkFile(resolve, reject) {
    try {
        if (fs.existsSync(`../../${dist}/bundle.js`)) {
            resolve("Build Complete");
            count = 0;
        } else {
            count++;
            if (count > 100) {
                reject("Bundle bundle.js Not found");
            } else {
                setTimeout(function () { checkFile(resolve, reject); }, 1000);
                if (count === 1) {
                    log(chalk.blue.bold("waiting..."));
                }
            }
        }
    } catch (err) {
        console.error(err);
        reject("Bundle bundle.js Not found");
    }
}

function aliases() {
    return {
        entries: [
            { find: "setglobals", replacement: modResolve("appl/js/utils/set.globals") },
            { find: "setimports", replacement: modResolve("appl/js/utils/set.imports") },
            { find: "app", replacement: modResolve("appl/js/app.js") },
            { find: "router", replacement: modResolve("appl/router") },
            { find: "config", replacement: modResolve("appl/js/config") },
            { find: "helpers", replacement: modResolve("appl/js/utils/helpers") },
            { find: "setup", replacement: modResolve("appl/js/utils/setup") },
            { find: "menu", replacement: modResolve("appl/js/utils/menu.js") },
            { find: "default", replacement: modResolve("appl/js/utils/default") },
            { find: "basecontrol", replacement: modResolve("appl/js/utils/base.control") },
            { find: "start", replacement: modResolve("appl/js/controller/start") },
            { find: "pdf", replacement: modResolve("appl/js/controller/pdf") },
            { find: "table", replacement: modResolve("appl/js/controller/table") },
            { find: "pager", replacement: "../../node_modules/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js" },
            { find: "popper", replacement: "../../node_modules/popper.js/dist/esm/popper.js" },
            { find: "handlebars", replacement: "../../node_modules/handlebars/dist/handlebars.min.js" },
            { find: "bootstrap", replacement: "../../node_modules/bootstrap/dist/js/bootstrap.min.js" },
            { find: "apptest", replacement: "../appl/jasmine/apptest.js" },
            { find: "contacttest", replacement: "./contacttest.js" },
            { find: "domtest", replacement: "./domtest.js" },
            { find: "logintest", replacement: "./logintest.js" },
            { find: "routertest", replacement: "./routertest.js" },
            { find: "toolstest", replacement: "./toolstest.js" },
            { find: "dodextest", replacement: "./dodextest.js" },
            { find: "inputtest", replacement: "./inputtest.js" },
            { find: "vue", replacement: "../../node_modules/vue/dist/vue.esm-bundler.js" },
            { find: "@", replacement: modResolve("appl") },
        ]
    };
}

function copySrc() {
    return src(["../appl/views/**/*", "../appl/templates/**/*", "../appl/index.html", "../appl/assets/**/*", "../appl/dodex/**/*", isProduction ? "../appl/testapp.html" : "../appl/testapp_dev.html"])
        .pipe(copy("../../" + dist + "/appl"));
}

function copyIndex() {
    return src(["../index.html"])
        .pipe(copy("../../" + dist + "/rollup"));
}

function copyImages() {
    return src(["../images/*", "../../README.md"])
        .pipe(copy("../../" + dist + "/appl"));
}

function copyCss() {
    return src(["../appl/css/site.css"])
        .pipe(copy("../../" + dist + "/appl"));
}

// function copyNodeCss() {
//     return src(["../../node_modules/bootstrap/dist/css/bootstrap.min.css", "../../node_modules/font-awesome/css/font-awesome.css",
//         "../../node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css", "../../node_modules/tablesorter/dist/css/theme.blue.min.css"])
//         .pipe(copy("../../" + dist + "/appl"));
// }

// function copyFonts() {
//     return src(["../../node_modules/font-awesome/fonts/**/*"])
//         .pipe(copy("../../" + dist + "/appl"));
// }
// function copyFonts2() {
//     return src(["../../node_modules/font-awesome/fonts/**/*"])
//         .pipe(copy("../../" + dist + "/fonts"));
// }

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
//per stackoverflow - Converting milliseconds to minutes and seconds with Javascript
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return ((seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds) + (minutes === 0 ? " seconds" : "minutes"));

}
// From Stack Overflow - Node (Gulp) process.stdout.write to file
if (process.env.USE_LOGFILE == "true") {
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
