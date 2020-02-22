import vm from "../entry";
import "config";
import Setup from "setup";
import popper from "popper.js";
import App from "app";
import Default from "default";
import "pager";
/* develblock:start */
window._bundler = "fusebox";
/* develblock:end */
window.Popper = popper;
App.init(Default);
Setup.init();
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
new Promise((resolve) => {
    setTimeout(function () {
        resolve(0);
    }, 500);
}).then(() => {
    if (typeof testit !== "undefined" && testit) {
        var apptest = require("apptest").apptest;
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App, vm);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();
    }
}).catch(rejected => {
    throw `Error ${rejected}`;
});
/* develblock:end */
