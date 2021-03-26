import { createApp } from "vue";
import { createStore } from "vuex";
import router from "./router";
import App from "../App.vue";
import DodexC from "../components/DodexC.vue";
// vuex
import { mutations, STORAGE_KEY } from "../vuex/mutations";
import actions from "../vuex/actions";
import plugins from "../vuex/plugins";

const getters = {
  getCounts: (state, index) => state.selections[index].count,
  getSelections: state => state.selections
};

const store = createStore({
  state: {
    selections: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"),
    count: 0,
    text: null
  },
  getters,
  actions,
  mutations,
  plugins
});

const vueApp = createApp({
  el: "#app",
  router,
  // store,
  components: { App },
  template: "<App/>"
});

vueApp.use(router);
vueApp.use(store);
vueApp.component("DodexC", DodexC);

// Change route if navigating to anchor on README page and refreshing the page
if(location.hash.startsWith("#/vue-")) {
  vueApp._component.router.push({path: "/"});
}

export default vueApp;
