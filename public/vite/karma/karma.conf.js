const base = "http://localhost:3080/vite/dist";
const startupHtml = "http://localhost:3080/vite/dist/index.html";

// Karma configuration
module.exports = function (config) {
    // whichBrowser to use from gulp task.su
    if (!global.whichBrowser) {
        global.whichBrowser = ["ChromeHeadless", "FirefoxHeadless"];
    }

    config.set({
        root: "",
        base: "",
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../",
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine-jquery"],
        proxies: {
            /* Integration testing with backend Java Vertx server */
            "/views/": base + "/views/",
            "/templates/": base + "/templates/",
            "/dodex/data/": base + "/dodex/data/",
            "/README.md": base + "/README.md",
            "/images/": base + "/images/",
            "/assets/": "./assets/"
        },
        // list of files / patterns to load in the browser
        files: [
            // Webcomponents for Firefox - used for link tag with import attribute.
            {pattern: "src/appl/jasmine/webcomponents-hi-sd-ce.js", watched: false},
            // Application and Acceptance specs.
            startupHtml,
            // Jasmine tests
            "src/tests/unit_tests*.js",
            { pattern: "dist/**/*.js", included: true, watched: false, type: "module" },
            { pattern: "src/images/favicon.ico", included: false, watched: false },
            { pattern: "package.json", watched: false, included: false },
            // Jasmine/Loader tests and starts Karma
            "karma/karma.bootstrap.js"
        ],
        bowerPackages: [
        ],
        plugins: [
            "karma-*",
            "@metahubt/karma-jasmine-jquery"
        ],
        /* Karma uses <link href="/base/appl/testapp_dev.html" rel="import"> -- you will need webcomponents polyfill to use browsers other than Chrome.
         * This test demo will work with Chrome/ChromeHeadless by default - Webcomponents included above, so FirefoxHeadless should work also. 
         * Other browsers may work with tdd.
         */
        browsers: global.whichBrowser,
        customLaunchers: {
            FirefoxHeadless: {
                base: "Firefox",
                flags: ["--headless", "--disable-web-security"]
            },
            ChromeD: {
                base: "Chrome",
                flags: ["--disable-web-security"]
            },
            ChromeH: {
                base: "ChromeHeadless",
                flags: ["--disable-web-security"]
            }
        },
        browserNoActivityTimeout: 0,
        exclude: [
        ],
        preprocessors: {
        },
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,
        autoWatch: true,
        // Continuous Integration mode
        singleRun: false,
        loggers: [{
                type: "console"
            }
        ],
        client: {
            captureConsole: true,
            clearContext: false,
            runInParent: true, 
            useIframe: true,
        },
        crossOriginAttribute: true,
        customHeaders: [{
            // match: "*localhost*.html",
            name: "Access-Control-Allow-Origin",
            value: "*"
          }],
        // how many browser should be started simultaneous
        concurrency: 5 // Infinity
    });
};
