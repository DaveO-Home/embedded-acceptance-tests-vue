import 'config'
import 'setglobals'
import App from 'app'
import Default from 'default'
import Setup from 'setup'
import 'tablepager'
/* develblock:start */
import Router from 'router'
import Helpers from 'helpers'
import Start from 'start'
/* develblock:end */
App.init(Default)

Setup.init()
/* develblock:start */
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
if (typeof testit !== 'undefined' && testit) {
    Promise.all([
        System.import('routertests'),
        System.import('domtests'),
        System.import('toolstests'),
        System.import('contacttests'),
        System.import('logintests')]).then(function (modules) {
        if (typeof testit !== 'undefined' && testit) {
            // Run acceptance tests.
            System.import('apptests').then(function (apptest) {
                apptest(Router, Helpers, App, Start, modules)
                __karma__.start()
            })
        }
    })
}
/* develblock:end */
