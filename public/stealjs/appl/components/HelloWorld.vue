<template>
  <div id="welcome" class="hello">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <div style="color: #ff3333; font-size: 1.5em;">(===>{{ msg2 }}<===)</div>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import Setup from 'setup'
import App from 'app'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Hi! - Acceptance Testing with a Vue.js App',
      msg2: 'Fix Me, main.css prod bundle is not being loaded by steal??'
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

<style scoped>
#welcome,div .hello {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  text-align: center;
  font-weight: normal;
  margin-top: 30px;
}
#welcome h1, h2 {
  font-weight: normal;
}
#welcome ul {
  list-style-type: none;
  padding: 0;
}
#welcome li {
  display: inline-block;
  margin: 0 10px;
}
#welcome a {
  color: #42b983;
}
</style>
