
<template>
  <iframe
    id="data"
    name="pdfDO"
    :src="pdfUrl"
    class="pdf col-lg-12"
    style="height: 750px"
  />
</template>

<script>
import Setup from "setup";
import App from "app";
// Setting up for optional Karma/Jasmine

App.init();
const url = "views/prod/Test.pdf";

export default {
  name: "PdfC",
  data() {
    return {
      pdfUrl: url
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      if (App.controllers["Start"]) {
        App.controllers["Start"].initMenu();
      }
      Setup.init();
    });
  }
};
// eslint-disable-next-line vue/no-parsing-error
</script scoped>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
