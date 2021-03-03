<template>
  <div
    id="welcome"
    class="hello"
  >
    <img src="../assets/logo.png">
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
import "../css/welcome.css";

export default {
  name: "HelloWorld",
  data () {
    return {
      msg: "Hi! - Acceptance Testing with a Vue3 App"
    };
  },
  mounted: function () {
    this.$nextTick(function () {
        if (App.controllers["Start"]) {
          App.controllers["Start"].initMenu();
        }
        Setup.init();
    });
  }
};
</script>
