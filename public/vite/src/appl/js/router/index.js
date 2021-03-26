import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from "../../components/HelloWorld.vue";
import StartC from "../../components/StartC.vue";
import PdfC from "../../components/PdfC.vue";
import ToolsC from "../../components/ToolsC.vue";
import ContactC from "../../components/ContactC.vue";
import NotFound from "../../components/NotFound.vue";

const env = process.env.NODE_ENV;
const appHtml = env === "development"? "_dev": "";

export default createRouter({
  history: createWebHashHistory(`/dist_test/webpack/appl/testapp${appHtml}.html`),
  routes: [
    {
      path: "/!/",
      name: "start",
      component: StartC
    },
    {
      hash: "/",
      name: "start2",
      component: StartC
    },
    {
      path: "/!/pdf/test",
      name: "test",
      component: PdfC
    },
    {
      path: "/pdf/test",
      name: "test2",
      component: PdfC
    },
    {
      path: "/!/table/tools",
      name: "tools",
      component: ToolsC
    },
    {
      path: "/table/tools",
      name: "tools2",
      component: ToolsC
    },
    {
      path: "/!/contact",
      name: "contact",
      component: ContactC
    },
    {
      path: "/contact",
      name: "contact2",
      component: ContactC
    },
    {
      path: "/!/welcome",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/welcome",
      name: "HelloWorld2",
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