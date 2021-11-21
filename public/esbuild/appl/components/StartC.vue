<template>
  <Suspense>
    <template #default>
      <StartA />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
<script>

import StartA from "./StartA.vue";
import setup from "../js/utils/setup";

export default {
  name: "StartC",
  components: { StartA },
  mounted: function () {
    this.$nextTick(() => {
      setup.init();
    });
  }
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>