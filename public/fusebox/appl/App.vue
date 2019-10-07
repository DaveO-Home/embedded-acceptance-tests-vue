<template src="./app_bootstrap.html" />
<script>
    import Start from "start";
    export default {
        name: "App",
        mounted: function () {
            this.$nextTick(function () {
                Start.init();
            });
        },
        methods: {
            loginModal: function () {
                Start["div .login click"]();
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
