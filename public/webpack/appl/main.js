/* eslint-disable no-unused-vars */
import vm from "./entry";
/* eslint-enable no-unused-vars */
import "config";
import "setglobals";
import app from "app";
import default0 from "default";
import setup from "setup";
import "tablepager";
/* develblock:start */
import apptest from "apptests";
/* develblock:end */

app.init(default0);
setup.init();

vm._component.router.isReady()
    .then(() => {
        vm.mount("#app");
    }).catch(e => console.error(e));

/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
new Promise((resolve) => {
    setTimeout(function () {
        resolve(0);
    }, 500);
}).catch(rejected => {
    fail(`Error ${rejected}`);
}).then(() => {
    if (typeof testit !== "undefined" && testit) {
        // var apptest = require("../tests/apptest");
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(app, vm);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();
    }
});
/* develblock:end */
