import "setglobals";
import { dodexApp, login, sidebar, content, footer } from "./entry";
import "config";
import app from "app";
import Default from "default";
import setup from "setup";
/* develblock:start */
import apptest from "apptest";
/* develblock:end */
import "tablesorter";
import "pager";

app.init(Default);
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
if (typeof testit !== "undefined" && testit) {
    new Promise((resolve) => {
        setTimeout(function () {
            resolve(0);
        }, 500);
    }).then(() => {
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(app, dodexApp, login, sidebar, content, footer);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;
        __karma__.start();
    }).catch(rejected => {
        throw `Error ${rejected}`;
    });
}
/* develblock:end */
