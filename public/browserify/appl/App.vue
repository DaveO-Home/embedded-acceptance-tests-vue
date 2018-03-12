<template src="./app_bootstrap.html">
</template>
<script>
    import Start from 'b/start'

    export default {
        name: 'app',
        mounted: function () {
            this.$nextTick(function () {
                Start.init()
            })
        },
        methods: {
            loginModal: function (event) {
                Start['div .login click']()
            }
        }
    }
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
