<template>
  <div
    id="data"
    class="hello"
  >
    <img :src="logo">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://v3.vuejs.org"
          target="_blank"
        >Core Docs v3</a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >Forum</a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >Community Chat</a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >Twitter</a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >Docs for This Template</a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="https://next.router.vuejs.org"
          target="_blank"
        >vue-router 4</a>
      </li>
      <li>
        <a
          href="https://next.vuex.vuejs.org/"
          target="_blank"
        >vuex 4</a>
      </li>
      <li>
        <a
          href=""
          target="_blank"
        >vue-loader</a>
      </li>
      <li>
        <a
          href="https://github.com/blacksonic/awesome-vue-3"
          target="_blank"
        >awesome-vue3</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Setup from "setup";
import App from "app";
import logo from "../../images/logo.png";

export default {
  name: "HelloWorld",
  data () {
    return {
      msg: "Hi! - Acceptance Testing with a Vue3.js App",
      logo: logo
    };
  },
  mounted: function () {
    this.$nextTick(() => {
        if (App.controllers["Start"]) {
          App.controllers["Start"].initMenu();
        }
        Setup.init();
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app,div {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  text-align: center;
  font-weight: normal;
  margin-top: 30px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>

