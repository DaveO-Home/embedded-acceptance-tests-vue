/* Generated by vue cli */
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const TerserPlugin = require("terser-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin, ProgressPlugin } = require("webpack");
const { NamedChunkIdsPlugin } = require("webpack").ids;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const resolveClientEnv = require("./resolveClientEnv");
const utils = require("./utils");
const rules = require("./prod_rules");
const assetsSubDirectory = ".";

rules.push(utils.stripBlock());

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}
module.exports =  {
  mode: "production",
  stats: {
    colors: true,
    children: false,
    warnings: false,
    modules: false
  },
  context: resolve("."),
  devtool: "source-map",
  node: false,
  output: {
    path: path.resolve(__dirname, "../..", "dist/webpack"),
    filename: "js/[name].[contenthash:8].js",
    publicPath: "../",
    chunkFilename: "js/[name].[contenthash:8].js"
  },
  target: "web",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../appl"),
      "vue$": "vue/dist/vue.esm-bundler.js",
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
      handlebars : "handlebars/dist/handlebars.js"
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
    rules: rules
  },
  optimization: {
    moduleIds: "deterministic",
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: "chunk-vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "initial"
        },
        common: {
          name: "chunk-common",
          minChunks: 2,
          priority: -20,
          chunks: "initial",
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      /* config.optimization.minimizer("terser") */
      new TerserPlugin(
        {
          terserOptions: {
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          },
          // sourceMap: true,
          // cache: true,
          parallel: true,
          extractComments: false
        }
      )
    ]
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
          NODE_ENV: "\"production\"",
          BASE_URL: "\"/\""
        }
      }
    ),
    // /* config.plugin("case-sensitive-paths") */
    new CaseSensitivePathsPlugin(),
    /* config.plugin("extract-css") */
    new MiniCssExtractPlugin(
      {
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].css"
      }
    ),
    /* config.plugin("named-chunks") */
    new NamedChunkIdsPlugin(
      chunk => {
        if (chunk.name) {
          return chunk.name;
        }

        const hash = require("hash-sum")
        const joinedHash = hash(
          Array.from(chunk.modulesIterable, m => m.id).join("_")
        );
        return `chunk-` + joinedHash;
      }
    ),
    /* config.plugin("html") */
    new HtmlWebpackPlugin(
      {
        title: "embedded-acceptance-tests-vue",
        templateParameters: (compilation, assets, pluginOptions) => {
          // enhance html-webpack-plugin"s built in template params
          let stats
          return Object.assign({
            // make stats lazy as it is expensive
            get webpack () {
              return stats || (stats = compilation.getStats().toJson())
            },
            compilation: compilation,
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              files: assets,
              options: pluginOptions
            }
          }, resolveClientEnv({} /*options*/, true /* raw */))
        },
        minify: {
          removeComments: true,
          collapseWhitespace: false,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
        },
        template: path.resolve(__dirname, "..", "appl/testapp.html"),
        filename: "./appl/testapp.html"
      }
    ),
    new CopyWebpackPlugin({ patterns: [
      {
        from: path.resolve(__dirname, "../static"),
        to: assetsSubDirectory
      },
      { from: "./appl/index.html", to: assetsSubDirectory },
      { from: "./appl/index.html", to: "./appl" },
      { from: "../README.md", to: "../" },
      {
        from: "./appl/templates/**/*",
        globOptions: {
          dot: false
        },
        to: assetsSubDirectory
      },
      {
        from: "./appl/views/**/*",
        globOptions: { 
          dot: false
        },
        to: assetsSubDirectory
      },
      {
        from: "./appl/dodex/**/*",
        globOptions: {
          dot: false
        },
        to: assetsSubDirectory
      },
      {
        from: "./images/**/*",
        globOptions: { 
          dot: false
        },
        to: assetsSubDirectory
      }
    ]}),
    new ProgressPlugin()
  ],
  entry: {
    app: [
      "./appl/main.js"
    ]
  }
};
