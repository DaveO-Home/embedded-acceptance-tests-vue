import { createApp } from "vue";
import { createStore } from "vuex";
import router from "./router/index";
import App from "../App.vue";
import dodex from "dodex";
import input from "dodex-input";
import mess from "dodex-mess";
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
    selections: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
  },
  getters,
  actions,
  mutations,
  plugins
});

const vueApp =  createApp({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
// console.log("VueApp:*********", vueApp)
vueApp.use(router);
vueApp.use(store);
vueApp.component("DodexC", DodexC);

// Change route if navigating to anchor on README page and refreshing the page
if(location.hash.startsWith("#/vue-")) {
  vueApp._component.router.push({path: "/"});
}

setTimeout(function() {
  if (typeof testit === "undefined" || (typeof testit !== "undefined" && !testit)) {
    if (document.querySelector(".top--dodex") === null) {
      // Content for cards A-Z and static card
      dodex.setContentFile("./dodex/data/content.js");
      dodex.init({
        width: 375,
        height: 200,
        left: "50%",
        top: "100px",
        input: input,    	// required if using frontend content load
        private: "full", 	// frontend load of private content, "none", "full", "partial"(only cards 28-52) - default none
        replace: true,   	// append to or replace default content - default false(append only)
        mess: mess
      }).then(function () {
        // Add in app/personal cards
        for (let i = 0;i < 3;i++) {
          dodex.addCard(getAdditionalContent());
        }
        /* Auto display of widget */
        // dodex.openDodex();
      });
    }
  }
},1000);
export default vueApp;

function getAdditionalContent() {
  return {
    cards: {
      card28: {
        tab: "F01999", // Only first 3 characters will show on the tab.
        front: {
          content: `<h1 style="font-size: 10px;">Friends</h1>
      <address style="width:385px">
        <strong>Charlie Brown</strong> 	111 Ace Ave. Pet Town
        <abbr title="phone"> : </abbr>555 555-1212<br>
        <abbr title="email" class="mr-1"></abbr><a href="mailto:cbrown@pets.com">cbrown@pets.com</a>
      </address>
      `
        },
        back: {
          content: `<h1 style="font-size: 10px;">More Friends</h1>
      <address style="width:385px">
        <strong>Lucy</strong> 113 Ace Ave. Pet Town
        <abbr title="phone"> : </abbr>555 555-1255<br>
        <abbr title="email" class="mr-1"></abbr><a href="mailto:lucy@pets.com">lucy@pets.com</a>
      </address>
      `
        }
      },
      card29: {
        tab: "F02",
        front: {
          content: "<h1 style=\"font-size: 14px;\">My New Card Front</h1>"
        },
        back: {
          content: "<h1 style=\"font-size: 14px;\">My New Card Back</h1>"
        }
      }
    }
  };
}
