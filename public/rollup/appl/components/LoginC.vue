<template>
  <div class="nav-login" @click="loginModal">
    <small>
      <a href="#" class="login">Log In</a>
    </small>
  </div>
</template>
<script>
import Start from "../js/controller/start";
export default {
  name: "LoginC",
  methods: {
    loginModal: function() {
      Start.initMenu();
      Start["div .login click"]();
    }
  }
};
</script>
