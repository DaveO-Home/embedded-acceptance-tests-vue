import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from "../../components/HelloWorld.vue";
import StartC from "../../components/StartC.vue";
import PdfC from "../../components/PdfC.vue";
import ToolsC from "../../components/ToolsC.vue";
import ContactC from "../../components/ContactC.vue";
import NotFound from "../../components/NotFound.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/!/",
      alias: "/",
      name: "start",
      component: StartC
    },
    {
      path: "/!/pdf/test",
      alias: "/pdf/test",
      name: "test",
      component: PdfC
    },
    {
      path: "/!/table/tools",
      alias: "/table/tools",
      name: "tools",
      component: ToolsC
    },
    {
      path: "/!/contact",
      alias: "/contact",
      name: "contact",
      component: ContactC
    },
    {
      path: "/!/welcome",
      alias: "/welcome",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/vue:pathMatch(.*)" // for navigating on README.md page
    },
    {
      path: "/:pathMatch(.*)",
      component: NotFound
    }
  ]
});
