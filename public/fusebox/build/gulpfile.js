/**
 * Successful acceptance tests & lints start the production build.
 * Tasks are run serially, 'accept' -> 'pat' -> ('eslint', 'csslint', 'bootlint') -> 'build'
 */
const { src, dest, series, parallel, task } = require("gulp");
// const runFusebox = require("./fuse4.js");
const path = require("path");
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
// let useFtl = true;

// process.argv.forEach(function (val, index, array) {
//     useFtl = val === "--noftl" && useFtl ? false : useFtl;
//     if(index > 2) {
//         process.argv[index] = "";
//     }
// });

if (browsers) {
    global.whichBrowser = browsers.split(",");
}
const isWindows = /^win/.test(process.platform);

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
                log(data.trim());
            }
        });
        cmd.stderr.on("data", (data) => {
            if (data && data.length > 0)
                log(data.trim());
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
            log(data.trim());
        }
    });
    cmd.stderr.on("data", (data) => {
        if (data && data.length > 0)
            log(data.trim());
    });
    return cmd.on("exit", (code) => {
        log(chalk.green(`Build successful - ${code}`));
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
            log(data.trim());
        }
    });
    cmd.stderr.on("data", (data) => {
        if (data && data.length > 0)
            log(data.trim());
    });
    return cmd.on("exit", (code) => {
        log(chalk.green(`Build successful - ${code}`));
        cb();
    });
};
/*
 * Build the application to run karma acceptance tests with hmr
 */
// const fuseboxHmr = function (cb) {
//     process.argv[2] = "";
//     const props = {
//         isKarma: false,
//         isHmr: true,
//         isWatch: true,
//         env: "development",
//         useServer: true,
//         ftl: useFtl
//     };
//     let mode = "test";
//     const debug = true;
//     try {
//         runFusebox(mode, fuseboxConfig(mode, props), debug, cb);
//     } catch (e) {
//         log("Error", e);
//     }
// };

// const setNoftl = function (cb) {
//     useFtl = false;
//     cb();
// };

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
                log(data.trim());
            }
        });
        cmd.stderr.on("data", (data) => {
            if (data && data.length > 0)
                log(data.trim());
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

const runProd = series(accept, pat, parallel(esLint, cssLint, bootLint), build);
runProd.displayName = "prod";

task(runProd);
exports.default = runProd;
exports.test = series(accept, pat);
exports.tdd = fusebox_tdd;
exports.hmr = fusebox_hmr;
// exports.hmr = fuseboxHmr;
exports.rebuild = fusebox_rebuild;
exports.acceptance = fb_test;
exports.development = parallel(fusebox_hmr, series(accept, fusebox_tdd));
exports.lint = parallel(esLint, cssLint, bootLint);

/* waiting for vue support in v4 */
function fuseboxConfig(mode, props) {
    mode = mode || "test";
    // if(process.argv[2]) {
    //     mode = process.argv[2];
    // }
    if (typeof props === "undefined") {
        props = {};
    }
    const appSrc = path.join(__dirname, "../appl");
    let toDist = "";
    let isProduction = mode !== "test";
    let distDir = isProduction ? path.join(__dirname, "../../dist/fusebox") : path.join(__dirname, "../../dist_test/fusebox");
    let defaultServer = props.useServer;
    let devServe = {
        httpServer: {
            root: "../../",
            port: 3080,
            open: false
        },
    };
    const configure = {
        target: "browser",
        env: { NODE_ENV: isProduction ? "production" : "development" },
        homeDir: appSrc,
        entry: path.join(__dirname, "../appl/main.ts"),
        output: `${distDir}${toDist}`,
        cache: {
            root: path.join(__dirname, ".cache"),
            enabled: !isProduction,
            FTL: typeof props.ftl === "undefined" ? true : props.ftl
        },
        sourceMap: !isProduction,
        webIndex: {
            distFileName: isProduction ? path.join(__dirname, "../../dist/fusebox/appl/testapp.html") : path.join(__dirname, "../../dist_test/fusebox/appl/testapp_dev.html"),
            publicPath: "../",
            template: isProduction ? path.join(__dirname, "../appl/index_prod.html") : path.join(__dirname, "../appl/index_dev.html")
        },
        tsConfig: path.join(__dirname, "tsconfig.json"),
        watch: props.isWatch && !isProduction,
        hmr: props.isHmr && !isProduction,
        devServer: defaultServer ? devServe : false,
        logging: { level: "succinct" },
        turboMode: true,
        exclude: isProduction ? "**/*test.js" : "",
        resources: {
            resourceFolder: "./appl/resources",
            resourcePublicRoot: isProduction ? "appl/resources" : "./resources",
        },
        plugins: []
    };
    return configure;
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
