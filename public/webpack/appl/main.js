import "setglobals";
// /* eslint-disable no-unused-vars */
import { dodexApp, login, sidebar, content, footer } from "./entry";
// /* eslint-enable no-unused-vars */
import "config";
import app from "app";
import default0 from "default";
import setup from "setup";
import "tablepager";
/* develblock:start */
import apptest from "apptests";
/* develblock:end */

app.init(default0);
setup.init();

dodexApp._component.router.isReady()
    .then(() => {
        if (typeof testit === "undefined" || !testit) {
            dodexApp.mount("#dodex");
            login.mount("#login");
            sidebar.mount("#sidebar");
            content.mount("#content");
            footer.mount("#footer");
        }
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
        apptest(app, dodexApp, login, sidebar, content, footer);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();
    }
});
/* develblock:end */
