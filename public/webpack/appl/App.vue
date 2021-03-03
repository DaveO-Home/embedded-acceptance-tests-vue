<template src="./app_bootstrap.html" />
<script>
import start from "start";

export default {
    name: "App",
    methods: {
        loginModal: function () {
            start["div .login click"]();
        }
    }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
