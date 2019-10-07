import Vue from "vue";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
export default new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});