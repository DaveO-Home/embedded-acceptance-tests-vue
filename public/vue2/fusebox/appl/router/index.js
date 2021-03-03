import VueRouter from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import StartC from "../components/StartC.vue";
import PdfC from "../components/PdfC.vue";
import ToolsC from "../components/ToolsC.vue";
import ContactC from "../components/ContactC.vue";

export default new VueRouter({
  mode: "hash",
  base: window.location.href,
  routes: [
    {
      path: "/",
      name: "start",
      component: StartC
    },
    {
      path: "/pdf/test",
      name: "test",
      component: PdfC
    },
    {
      path: "/table/tools",
      name: "tools",
      component: ToolsC
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactC
    },
    {
      path: "/welcome",
      name: "HelloWorld",
      component: HelloWorld
    }
  ]
});
