import Vue from 'vue'
import router from './router'
import App from '../App.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
    window._vue = new Vue({
      el: '#app',
      router,
      template: "<App/>",
      components: { App }
    })
