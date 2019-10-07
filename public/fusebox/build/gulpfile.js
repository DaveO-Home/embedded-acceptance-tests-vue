/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'accept' -> 'pat' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const { src, dest, series, parallel, task } = require("gulp");
const chalk = require("chalk");
const csslint = require("gulp-csslint");
const eslint = require("gulp-eslint");
const exec = require("child_process").exec;
const log = require("fancy-log");
const Server = require("karma").Server;

let lintCount = 0;
let dist = "dist_test/fusebox";
let isProduction = false;
let browsers = process.env.USE_BROWSERS;

if (browsers) {
    global.whichBrowser = browsers.split(",");
}
var isWindows = /^win/.test(process.platform);

/**
 * Default: Production Acceptance Tests 
 */
const pat = function (done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }

    new Server({
        configFile: __dirname + "/karma.conf.js",
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
    var stream = src(["../appl/**/*.js", "../appl/**/*.vue"])
        .pipe(eslint({
            configFile: "../../.eslintrc.js", // 'eslintConf.json',
            quiet: 1,
            fix: false
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
    });
};
/*
 * css linter
 */
const cssLint = function (cb) {
    var stream = src(["../appl/css/site.css"
    ])
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
 * Build the application to run karma acceptance tests
 */
const accept = function (cb) {
    var osCommands = "cd ..; export NODE_ENV=development; export USE_KARMA=true; export USE_HMR=false; ";

    if (isWindows) {
        osCommands = "cd ..\\ & set NODE_ENV=development & set USE_KARMA=true & set USE_HMR=false & ";
    }

    exec(osCommands + "node fuse.js", function (err, stdout, stderr) {
        log(chalk.cyan("Building Test - please wait......"));
        let cmd = exec(osCommands + "node fuse.js");
        cmd.stdout.on("data", (data) => {
            if (data && data.length > 0) {
                console.log(data.trim());
            }
        });
        cmd.stderr.on("data", (data) => {
            if (data && data.length > 0)
                console.log(data.trim());
        });
        return cmd.on("exit", (code) => {
            log(chalk.green(`Build successful - ${code}`));
            cb();
        });
    });
};
/*
 * Build the application to the production distribution 
 */
const build = function (cb) {
    var osCommands = "cd ..; export NODE_ENV=production; export USE_KARMA=false; export USE_HMR=false; ";

    if (isWindows) {
        osCommands = "cd ..\\ & set NODE_ENV=production & set USE_KARMA=false & set USE_HMR=false & ";
    }

    log(chalk.cyan("Production Build - please wait......"));
    let cmd = exec(osCommands + "node fuse.js");
    cmd.stdout.on("data", (data) => {
        if (data && data.length > 0) {
            console.log(data.trim());
        }
    });
    cmd.stderr.on("data", (data) => {
        if (data && data.length > 0)
            console.log(data.trim());
    });
    return cmd.on("exit", (code) => {
        log(chalk.green(`Build successful - ${code}`));
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
        if (err) {
            log("ERROR", err);
        } else {
            log(chalk.green("Bootstrap linting a success"));
        }
        cb();
    });
};
/*
 * Build the application to run karma acceptance tests with hmr
 */
const fusebox_hmr = function (cb) {
    var osCommands = "cd ..; export NODE_ENV=development; export USE_KARMA=false; export USE_HMR=true; ";

    if (isWindows) {
        osCommands = "cd ..\\ & set NODE_ENV=development & set USE_KARMA=false & set USE_HMR=true & ";
    }

    log(chalk.cyan("Configuring HMR - please wait......"));
    let cmd = exec(osCommands + "node fuse.js");
    cmd.stdout.on("data", (data) => {
        if (data && data.length > 0) {
            console.log(data.trim());
        }
    });
    cmd.stderr.on("data", (data) => {
        if (data && data.length > 0)
            console.log(data.trim());
    });
    return cmd.on("exit", (code) => {
        log(chalk.green(`Build successful - ${code}`));
        cb();
    });
};
/*
 * Build the application to run node express so font-awesome is resolved
 */
const fusebox_rebuild = function (cb) {
    var osCommands = "cd ..; export NODE_ENV=development; export USE_KARMA=false; export USE_HMR=false; ";

    if (isWindows) {
        osCommands = "cd ..\\ & set NODE_ENV=development & set USE_KARMA=false & set USE_HMR=false & ";
    }

    exec(osCommands + "node fuse.js", function (err, stdout, stderr) {
        log(chalk.cyan("Rebuilding - please wait......"));
        let cmd = exec(osCommands + "node fuse.js");
        cmd.stdout.on("data", (data) => {
            if (data && data.length > 0) {
                console.log(data.trim());
            }
        });
        cmd.stderr.on("data", (data) => {
            if (data && data.length > 0)
                console.log(data.trim());
        });
        return cmd.on("exit", (code) => {
            log(chalk.green(`Build successful - ${code}`));
            cb();
        });
    });
};
/**
 * Run karma/jasmine tests once and exit
 */
const fb_test = function (done) {
    if (!browsers) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        done();
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
};
/**
 * Continuous testing - test driven development.  
 */
const fusebox_tdd = function (done) {
    if (!browsers) {
        global.whichBrowser = ["Chrome", "Firefox"];
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
        global.whichBrowser = ["Opera"];
    }
    new Server({
        configFile: __dirname + "/karma.conf.js",
    }, done).start();
};

runProd = series(accept, pat, parallel(esLint, cssLint, bootLint), build);
runProd.displayName = "prod";

task(runProd);
exports.default = runProd;
exports.test = series(accept, pat);
exports.tdd = fusebox_tdd;
exports.hmr = fusebox_hmr;
exports.rebuild = fusebox_rebuild;
exports.acceptance = fb_test;
exports.development = parallel(fusebox_hmr, series(accept, fusebox_tdd));
exports.lint = parallel(esLint, cssLint, bootLint);

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
