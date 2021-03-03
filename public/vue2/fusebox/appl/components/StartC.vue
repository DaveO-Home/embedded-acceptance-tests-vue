<template>
  <span
    id="data"
    v-html="index"
  />
</template>
<script>

import Start from "start";
import Setup from "setup";
import Helpers from "helpers";

let inPromise = false;
let indexHtml = {
      index: null
    };

export default {
  name: "StartC",
  data () {
    this.getData();
    return indexHtml;
  },
  mounted: function () {
    this.$nextTick(function () {
      Setup.init();
    });
  },
  methods: {
    getData () {
      if (inPromise) {
        return indexHtml.index;
      }
      inPromise = true;
      Start.initMenu();
      Start.index();

      new Promise(function (resolve, reject) {
          let count = 0;
          Helpers.isLoaded(resolve, reject, indexHtml.index, Start, count, 10);
        })
        .catch(function (rejected) {
          console.warn("Failed", rejected);
        })
        .then(function (resolved) {
            indexHtml.index = resolved;
            inPromise = false;
            return indexHtml.index;
        });
    }
  }
};
</script>
