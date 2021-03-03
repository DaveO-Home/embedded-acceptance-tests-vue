import vm from "./entry";
import "b/config";
import "b/setglobals";
import App from "b/app";
import Default from "b/default";
import Setup from "b/setup";
import "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js";
//removeIf(production)
import apptest from "b/apptest";
//endRemoveIf(production)
App.init(Default);

Setup.init();
//removeIf(production)
//Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
//testit is true if running under Karma - see testapp_dev.html
new Promise((resolve) => {
    setTimeout(function () {
        resolve(0);
    }, 500);
}).then(() => {
    if (typeof testit !== "undefined" && testit) {
        //Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(App, vm);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();
    }
}).catch(rejected => {
    fail(`Error ${rejected}`);
});
//endRemoveIf(production)
