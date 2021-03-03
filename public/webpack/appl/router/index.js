import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import StartC from "@/components/StartC";
import PdfC from "@/components/PdfC";
import ToolsC from "@/components/ToolsC";
import ContactC from "@/components/ContactC";
import NotFound from "@/components/NotFound";

export default createRouter({
  hashbang: false,
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
