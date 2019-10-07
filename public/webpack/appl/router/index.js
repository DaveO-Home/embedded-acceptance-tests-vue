import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import StartC from "@/components/StartC";
import PdfC from "@/components/PdfC";
import ToolsC from "@/components/ToolsC";
import ContactC from "@/components/ContactC";

Vue.use(VueRouter);

export default new VueRouter({
  // mode: 'history',
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
