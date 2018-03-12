
import 'config'
import popper from 'popper.js'
import App from 'app'
import Router from './router/index.js'
import Default from 'default'
import Setup from 'setup'
import Helpers from 'helpers'
import 'tablepager'
import apptest from 'apptest'
window.Popper = popper
//
App.init(Default)
Setup.init()
//!steal-remove-start
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve(0)
    }, 500)
}).catch(rejected => {
    fail(`Error ${rejected}`)
}).then(resolved => {
    if (typeof testit !== "undefined" && testit) {
        // Run acceptance tests. - To run only unit tests, comment the apptest call.
        apptest(Router, Helpers, App)
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
        __karma__.start()
    }
})
//!steal-remove-end
