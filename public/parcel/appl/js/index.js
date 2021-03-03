
import "./utils/set.globals";
import vm from "./entry";
import "./config";
import app from "./app";
import default0 from "./utils/default";
import setup from "./utils/setup";
/* develblock:start */
import apptest from "../jasmine/apptest";
/* develblock:end */
import "tablesorter";
import "tablesorter/dist/js/extras/jquery.tablesorter.pager.min";

app.init(default0);
setup.init();

vm._component.router.isReady()
    .then(() => {
        vm.mount("#app");
    }).catch(e => console.error(e));

/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
if (typeof testit !== "undefined" && testit) {
    new Promise((resolve) => {
        setTimeout(function () {
            resolve(0);
        }, 500);
    }).then(() => {
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(app, vm);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();
    }).catch(rejected => {
        throw `Error ${rejected}`;
    });
}
/* develblock:end */
