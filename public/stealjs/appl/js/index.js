
import '../css/css'
import vm from '../entry'
import 'config'
import popper from 'popper.js'
import App from 'app'
import Default from 'default'
import Setup from 'setup'
import 'tablepager'
//!steal-remove-start
import apptest from '../jasmine/apptest'
//!steal-remove-end
window.Popper = popper
//
App.init(Default)
Setup.init()
//!steal-remove-start
// Code between the ..start and ..end tags will be removed by the BlockStrip plugin during the production build.
// testit is true if running under Karma - see testapp_dev.html
// Run acceptance tests.
if (typeof testit !== 'undefined' && testit) {
	apptest(App, vm)
}
//!steal-remove-end
