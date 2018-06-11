import Vue from 'vue'
import router from './js/router/index'
import App from './App.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
      el: '#app',
      router,
      template: "<App/>",
      components: { App }
    })
