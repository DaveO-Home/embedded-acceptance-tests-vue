import { createApp } from "vue";
import { createStore } from "vuex";
import router from "./router/index";
import DodexC from "../components/DodexC.vue";
import SidebarC from "../components/SidebarC.vue";
import LoginC from "../components/LoginC.vue";
import ContentC from "../components/ContentC.vue";
import FooterC from "../components/FooterC.vue";
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
    selections: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
  },
  getters,
  actions,
  mutations,
  plugins
});

const dodexApp =  createApp({
  el: "#dodex",
  store,
  router,
  components: { DodexC },
  template: "<DodexC/>"
});

const login =  createApp({
  el: "#login",
  components: { LoginC },
  template: "<LoginC/>"
});

const sidebar =  createApp({
  el: "#sidebar",
  components: { SidebarC },
  template: "<SidebarC/>"
});

const content =  createApp({
  el: "#content",
  components: { ContentC },
  template: "<ContentC/>"
});

const footer =  createApp({
  el: "#footer",
  components: { FooterC },
  template: "<FooterC/>"
});

sidebar.use(router);
content.use(router);
footer.use(router);
content.use(store);

// Change route if navigating to anchor on README page and refreshing the page
if(location.hash.startsWith("#/vue-")) {
  dodexApp._component.router.push({path: "/"});
}

export { dodexApp, login, sidebar, content, footer };
