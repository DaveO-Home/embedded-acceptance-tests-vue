
<template>
   <iframe id="data" name="pdfDO" v-bind:src="pdfUrl" class="pdf col-lg-12" style="height: 750px"></iframe>
</template>
<script>

import Setup from 'setup'
import App from 'app'
// Setting up for optional Karma/Jasmine

App.init()
const url = `${App.bUrl}${'/views/prod/Test.pdf'}`

export default {
  name: 'PdfC',
  data () {
    return {
      pdfUrl: url
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      if (App.controllers['Start']) {
          App.controllers['Start'].initMenu()
      }
      Setup.init()
    })
  }
}
</script scoped>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
