<template>
  <div class="txt">
    The Page Not Found
    <div />
    <div />
    <div class="center">
      <img :src="bomb">
    </div>
  </div>
</template>
<script>
const bomb = "images/bomb-gif.gif";
export default {
  name: "DeadEnd",
  data () {
    return {
      bomb: bomb
    };
  }
};
</script>
