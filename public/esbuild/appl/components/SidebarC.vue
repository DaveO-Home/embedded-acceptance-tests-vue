<template>
  <div id="root" class="nav-side-menu">
    <ul class="flex-column nav pl-4">
      <li class="nav-item">
        <router-link to="/">
          <i class="fa fa-fw fa-home"></i> Home
          <span class="sr-only">(current)</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/pdf/test">
          <i class="far fa-fw fa-file-pdf" /> PDF View
        </router-link>
      </li>
      <li class="nav-header nav-item">Statistics</li>
      <li class="nav-item">
        <router-link to="/table/tools">
          <i class="fa fa-fw fa-table" /> Tabular View
        </router-link>
      </li>
      <li class="nav-header nav-item">Vue</li>
      <li class="nav-item">
        <router-link to="/welcome">
          <i class="far fa-fw fa-hand-paper" /> Vue Welcome
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: "SidebarC",
  // data() {
  //   return {
  //     bomb: bomb,
  //   };
  // },
};
</script>
