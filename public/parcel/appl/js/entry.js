import Vue from '../../../node_modules/vue/dist/vue'
import router from './router/index'
import App from '../App.vue'

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
