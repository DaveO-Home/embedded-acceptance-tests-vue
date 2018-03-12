import Vue from 'b/vue'
import App from './App.vue'
import router from './router'
import './index' // Loads the App modules and test environment

Vue.config.productionTip = false

/* eslint-disable no-new */
window._vue = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
