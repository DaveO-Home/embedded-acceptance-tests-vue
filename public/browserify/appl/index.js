import 'b/config'
import 'b/setglobals'
import App from 'b/app'
import Default from 'b/default'
import Setup from 'b/setup'
import 'b/pager'
//removeIf(production)
import Router from './router'
import Helpers from 'b/helpers'
//endRemoveIf(production)
App.init(Default)

Setup.init()
//removeIf(production)
//Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
//testit is true if running under Karma - see testapp_dev.html
new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve(0)
    }, 500);
}).catch(rejected => {
    fail(`Error ${rejected}`)
}).then(resolved => {
    if (typeof testit !== "undefined" && testit) {
        var apptest = require("b/apptest").apptest;
        //Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(Router, Helpers, App);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        __karma__.start();
    }
})
//endRemoveIf(production)
