
<template>
   <iframe id="data" name="pdfDO" v-bind:src="pdfUrl" class="col-lg-12" style="height: 750px"></iframe>
</template>
<script>

import Setup from '../js/utils/setup'
import App from '../js/app'

App.init()
const url = 'views/prod/Test.pdf'

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
</script>