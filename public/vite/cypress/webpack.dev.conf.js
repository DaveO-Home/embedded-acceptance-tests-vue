const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");
// const PreloadPlugin = require("@vue/preload-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, "../src", dir);
}
module.exports = {
  mode: "development",
  context: resolve("."), //path.resolve(__dirname),
  node: false,
  target: "web",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../appl"),
      "vue$": "vue/dist/vue.esm-bundler.js",
      // "vue$": "vue/dist/vue.esm-bundler.js",
      app: resolve("appl/js/app.js"),
      basecontrol: resolve("appl/js/utils/base.control"),
      config: resolve("appl/js/config"),
      default: resolve("appl/js/utils/default"),
      helpers: resolve("appl/js/utils/helpers"),
      menu: resolve("appl/js/utils/menu.js"),
      pdf: resolve("appl/js/controller/pdf"),
      router: resolve("appl/router"),
      start: resolve("appl/js/controller/start"),
      setup: resolve("appl/js/utils/setup"),
      setglobals: resolve("appl/js/utils/set.globals"),
      table: resolve("appl/js/controller/table"),
      tablepager: "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js",
      tablewidgets: "tablesorter/dist/js/jquery.tablesorter.widgets.min.js",
      apptests: resolve("tests/apptest"),
      contacttests: resolve("tests/contacttest"),
      domtests: resolve("tests/domtest"),
      logintests: resolve("tests/logintest"),
      routertests: resolve("tests/routertest"),
      toolstests: resolve("tests/toolstest"),
      dodextests: resolve("tests/dodextest"),
      inputtests: resolve("tests/inputtest"),
      handlebars: "handlebars/dist/handlebars.js"
    },
    extensions: [
      ".mjs",
      ".js",
      ".jsx",
      ".vue",
      ".json",
      ".wasm"
    ],
    modules: [
      "node_modules",
      path.resolve(__dirname, "../..", "node_modules"),
      path.resolve(__dirname, "../..", "node_modules/@vue/cli-service/node_modules")
    ],
  },
  resolveLoader: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "../..", "node_modules"),
      path.resolve(__dirname, "../..", "node_modules/@vue/cli-service/node_modules")
    ],
  },
  module: {
    exprContextCritical: false,
    noParse: /^(vue|vue-router|vuex|vuex-router-sync|dodex(.?))$/,
    rules: require("./dev_rules") 
  },
  plugins: [
    /* config.plugin("vue-loader") */
    new VueLoaderPlugin(),
    /* config.plugin("feature-flags") */
    new DefinePlugin(
      {
        __VUE_OPTIONS_API__: "true",
        __VUE_PROD_DEVTOOLS__: "false"
      }
    ),
    /* config.plugin("define") */
    new DefinePlugin(
      {
        "process.env": {
          NODE_ENV: "\"development\"",
          BASE_URL: "\"/\""
        }
      }
    )
  ],
}
