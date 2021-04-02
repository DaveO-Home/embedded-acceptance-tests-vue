const karma = require("karma");
const path = require("path");

let browsers = process.env.USE_BROWSERS;

if (browsers) {
    global.whichBrowser = browsers.split(",");
}

karmaServer();

function karmaServer(singleRun = true, watch = false) {
    const parseConfig = karma.config.parseConfig;
    const Server = karma.Server;

    parseConfig(
        path.resolve("./karma/karma.conf.js"),
        { port: 9876, singleRun: singleRun, watch: watch },
        { promiseConfig: true, throwErrors: true },
    ).then(
        (karmaConfig) => {
            new Server(karmaConfig, function doneCallback(exitCode) {
                console.log("Karma has exited with " + exitCode);
                if (exitCode > 0) {
                    process.exit(exitCode);
                }
            }).start();
        },
        (rejectReason) => { console.err(rejectReason); }
    );
}
