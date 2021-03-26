const Server = require("karma").Server;

let browsers = process.env.USE_BROWSERS;

if (browsers) {
    global.whichBrowser = browsers.split(",");
}
new Server({
        configFile: __dirname + "/karma/karma.conf.js",
        singleRun: true
    }, function (result) {
        var exitCode = !result ? 0 : result;
        if (exitCode > 0) {
            process.exit(exitCode);
        }
    }).start();
