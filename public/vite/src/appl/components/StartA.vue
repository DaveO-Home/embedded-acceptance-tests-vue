<template>
  <AsyncComp />
</template>

<script>
import start from "start";
import helpers from "helpers";
// import "setglobals";
import { defineAsyncComponent } from "vue";

const AsyncComp = defineAsyncComponent(() => {
  const p = new Promise((resolve) => {
    getHtml(resolve);
  });
  return p;
});

const indexHtml = {
  index: null
};

export default {
  name: "StartA",
  components: { AsyncComp },
  setup() {
    start.initMenu();
    start.index();
  }
};

function getHtml(asyncResolve) {
  new Promise((resolve, reject) => {
    let count = 0;
    helpers.isLoaded(resolve, reject, indexHtml.index, start, count, 10);
  })
    .catch((rejected) => {
      console.warn("Failed", rejected);
    })
    .then((loadedHtml) => {
      /*
        Cypress/Vue are parsing/injecting into loaded html when using @vue/test-utils mount(component)?
      */
      if(typeof Cypress !== "undefined" && window.__mountMethod) {
        loadedHtml = `<br/>
          <div class="mx-auto" style="width: 95%">
              <h1>Welcome To</h1>
              <h3>Application Acceptance Testing</h3>
              <p class="f16">
                  This Demo Application uses Vue.js(https://v3.vuejs.org) Javascript libraries to route, load and process HTML. The presentation is based on Bootstrap 4.
                  Testing is accomplished by injecting Jasmine specs in the application running within a Karma test-runner environment. 
                  Generally the specs are coded by the developer in a test driven environment. However the tests can be isolated from the application code and loaded in a single
                  location(see index.js).  This allows test and production groups to develop end to end testing. Please review the included read-me.        
              </p>
          </div>
          <p></p>
          <div class="mx-auto markdown" style="width: 90%"></div>`;
      }
      return asyncResolve({
        template: loadedHtml
      });
    });
}
</script>
