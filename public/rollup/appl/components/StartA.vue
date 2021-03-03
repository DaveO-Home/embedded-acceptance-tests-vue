<template>
  <AsyncComp />
</template>

<script>
import start from "start";
import helpers from "helpers";
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
  },
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
      return asyncResolve({
        template: loadedHtml
      });
    });
}
</script>
