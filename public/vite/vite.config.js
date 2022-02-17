import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
var path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: process.env.NODE_ENV !== "production"? "src/appl": "public",
  mode: process.env.NODE_ENV,
  clearScreen: false,
  resolve: { alias: [
      { find: "setglobals", replacement: modResolve("appl/js/utils/set.globals") },
      { find: "setimports", replacement: modResolve("appl/js/utils/set.imports") },
      { find: "entry", replacement: modResolve("appl/js/entry.js") },
      { find: "app", replacement: modResolve("appl/js/app.js") },
      { find: "router", replacement: modResolve("appl/router") },
      { find: "config", replacement: modResolve("appl/js/config") },
      { find: "helpers", replacement: modResolve("appl/js/utils/helpers") },
      { find: "setup", replacement: modResolve("appl/js/utils/setup") },
      { find: "menu", replacement: modResolve("appl/js/utils/menu.js") },
      { find: "default", replacement: modResolve("appl/js/utils/default") },
      { find: "basecontrol", replacement: modResolve("appl/js/utils/base.control") },
      { find: "start", replacement: modResolve("appl/js/controller/start") },
      { find: "pdf", replacement: modResolve("appl/js/controller/pdf") },
      { find: "table", replacement: modResolve("appl/js/controller/table") },
      { find: "pager", replacement: "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js" },
      { find: "handlebars", replacement: "handlebars/dist/handlebars.min.js" },
      { find: "bootstrap", replacement: "bootstrap/dist/js/bootstrap.esm.js" },
      { find: "apptest", replacement: "appl/jasmine/apptest.js" },
      { find: "contacttest", replacement: "./contacttest.js" },
      { find: "domtest", replacement: "./domtest.js" },
      { find: "logintest", replacement: "./logintest.js" },
      { find: "routertest", replacement: "./routertest.js" },
      { find: "toolstest", replacement: "./toolstest.js" },
      { find: "dodextest", replacement: "./dodextest.js" },
      { find: "inputtest", replacement: "./inputtest.js" },
      { find: "vue", replacement: "vue/dist/vue.esm-bundler.js" },
      { find: "startc", replacement: modResolve("appl/components/StartC.vue") },
      { find: "starta", replacement: modResolve("appl/components/StartA.vue") },
      { find: "toolsAsync", replacement: modResolve("appl/components/ToolsAsyncC.vue") },
      { find: "@", replacement: modResolve("appl") },
  ],
  },
  plugins: [vue()],
  server: {
    port: 4080,
    fs: {
      allow: ["./"],
    }
  },
  logLevel: "info",
  build: {
    target: "es2015",
    outDir: "dist",
    assetsDir: "assets",
    assetsInlineLimit: 4096,
    minify: process.env.INTEGRATION !== "true",
    root_level: "./"
  }
});

function modResolve(dir) {
  return path.join(__dirname, "src", dir);
}
