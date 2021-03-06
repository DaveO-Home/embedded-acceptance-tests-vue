// Karma configuration
var bundler = "stealjs";
module.exports = function (config) {

    if (!global.whichBrowsers) {
        global.whichBrowsers = ["ChromeHeadless, FirefoxHeadless"];
    }
    config.set({
        basePath: "../../",
        frameworks: ["jasmine-jquery", "jasmine"],
        proxies: {
            "/views/": "/base/" + bundler + "/appl/views/",
            "/templates": "/base/" + bundler + "/appl/templates",
            "/app_bootstrap.html": "/base/" + bundler + "/appl/app_bootstrap.html",
            "/README.md": "/base/README.md",
            "/stealjs/appl/": "/base/stealjs/appl/",
            "/index.js": "/base/stealjs/appl/main.js",
	        "/jquery.js": "/base/node_modules/jquery/dist/jquery.min.js",
            "/bootstrap.js": "/base/node_modules/bootstrap/dist/js/bootstrap.min.js",
            "/dodex/": "/base/" + bundler + "/appl/dodex/",
            "/images/": "/base/" + bundler + "/images/",
        },
        // list of files / patterns to load in the browser
        files: [
            //Webcomponents for Firefox - used for link tag with import attribute.
            {pattern: bundler + "/appl/jasmine/webcomponents-hi-sd-ce.js", watched: false},
            //Jasmine tests
            bundler + "/tests/unit_*.js",
            //Application and Acceptance specs.
            bundler + "/appl/testapp_karma.html",
            //Module loader - so we can run steal unit tests - see include-all-tests.js
            "node_modules/steal/steal.js",
            {pattern: "node_modules/steal/**/*.js", watched: false, included: false},
            {pattern: "node_modules/steal-css/css.js", watched: false, included: false},
            {pattern: "node_modules/steal-vue/**/*.js", watched: false, included: false},
            {pattern: "node_modules/bootstrap/**/*.js", watched: false, included: false},
            {pattern: "node_modules/popper.js/dist/umd/*", watched: false, included: false},
            {pattern: "node_modules/vue/**/*.js", watched: false, included: false},
            {pattern: "node_modules/vuex/**/*.js", watched: false, included: false},
            {pattern: "node_modules/de-indent/index.js", watched: false, included: false},
            {pattern: "node_modules/he/he.js", watched: false, included: false},
            {pattern: bundler + "/appl/**/*", included: false},
            {pattern: "node_modules/vue-*/**/*.js", watched: false, included: false},
            {pattern: "node_modules/**/package.json", watched: false, included: false},
            {pattern: "node_modules/jquery/**/*.js", watched: false, served: true, included: false},
            {pattern: "node_modules/tablesorter/**/*.js", watched: false, served: true, included: false},
            {pattern: "package.json", watched: false, included: false},
            {pattern: "node_modules/lodash-es/**/*js", watched: false, included: false},
            {pattern: "node_modules/moment/**/*.js", watched: false, included: false},
            {pattern: "node_modules/rxjs/**/*.js", watched: false, included: false},
            {pattern: "node_modules/marked/**/*.js", watched: false, included: false},
            {pattern: "node_modules/handlebars/dist/**/*.js", watched: false, included: false},
            {pattern: "README.md", included: false},
            {pattern: "index.js", served: false, included: false, watched: false},
            {pattern: "dev-bundle.js", watched: false, included: false},
            {pattern: bundler + "/images/*", included: false},
            {pattern: "node_modules/bootstrap/dist/css/bootstrap.min.css", watched: false, included: false},
            {pattern: "node_modules/@fortawesome/fontawesome-free/css/all.min.css", watched: false, included: false},
            {pattern: "node_modules/tablesorter/dist/css/theme.blue.min.css", watched: false, included: false},
            {pattern: "node_modules/tablesorter/dist/css/jquery.tablesorter.pager.min.css", watched: false, included: false},
            {pattern: "node_modules/steal-css/**/*.js", watched: false, included: false},
            {pattern: "node_modules/font-awesome/css/font-awesome.css", watched: false, included: false},
            {pattern: "node_modules/font-awesome/fonts/*", watched: false, included: false},
            {pattern: "node_modules/dodex/dist/dodex.min.css", watched: false, included: false},
            {pattern: "node_modules/dodex/dist/dodex.min.js", watched: false, included: false},
            {pattern: "node_modules/dodex-input/dist/dodex-input.min.js", watched: false, included: false},
            {pattern: "node_modules/dodex-mess/dist/dodex-mess.min.js", watched: false, included: false},
            //Jasmine/Steal tests and starts Karma
            bundler + "/build/karma.bootstrap.js"
        ],
        bowerPackages: [
        ],
        plugins: [
            // "karma-*",
            "@metahub/karma-jasmine-jquery",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-opera-launcher",
            "karma-jasmine",
            "karma-mocha-reporter"
        ],
        /* Karma uses <link href="/base/appl/testapp_dev.html" rel="import"> -- you will need webcomponents polyfill to use browsers other than Chrome.
         * This test demo will work with Chrome/ChromeHeadless by default - Webcomponents included above, so FirefoxHeadless should work also. 
         * Other browsers may work with tdd.
         */
        browsers: global.whichBrowsers,
        customLaunchers: {
            FirefoxHeadless: {
                base: "Firefox",
                flags: ["--headless"]
            }
        },
        browserNoActivityTimeout: 0,
        exclude: [
        ],
        preprocessors: {
            "*/**/*.html": []
        },
        reporters: ["mocha"],
        port: 9876,
        colors: true,
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,
        autoWatch: true,
        singleRun: false,
        loggers: [{
                type: "console"
            }
        ],
        client: {
            captureConsole: true,
            clearContext: true
        },
        concurrency: 5, //Infinity
    });
};
