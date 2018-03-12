
import Vue from 'vue'
import App from '@/App'
import router from 'router'
import './index' // Loads the App modules and test environment

Vue.config.productionTip = false

/* eslint-disable no-new */
window._vue = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
