const path = require("path");
const isWatch = process.env.USE_WATCH === "true";
module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {
    const isLegacyBundle = process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD;
    const resolveLocal = require("../util/resolveLocal");
    const getAssetPath = require("../util/getAssetPath");
    const inlineLimit = 4096;

    const resolve = dir => {
      return path.join(__dirname, "../../../..", dir);
    };

    const genAssetSubPath = dir => {
      return getAssetPath(
        options,
        `${dir}/[name]${options.filenameHashing ? ".[hash:8]" : ""}.[ext]`
      );
    };

    const genUrlLoaderOptions = dir => {
      return {
        limit: inlineLimit,
        // use explicit fallback to avoid regression in url-loader>=1.1.0
        fallback: {
          loader: "file-loader",
          options: {
            name: genAssetSubPath(dir)
          }
        }
      };
    };

    const resolveAlias = dir => {
      return path.join(__dirname, "../../../..", dir);
    };

    webpackConfig
      .mode("development")
      .context(api.service.context)
      .entry("app")
        .add("../appl/main.js")
        .end()
      .output
        .path(api.resolve(options.outputDir))
        .filename(isLegacyBundle ? "[name]-legacy.js" : "[name].js")
        .publicPath(options.baseUrl)
        .end()
      .watch(isWatch);

    webpackConfig.resolve
      .extensions
        .merge([".js", ".jsx", ".vue", ".json"])
        .end()
      .modules
        .add("node_modules")
        .add(api.resolve("node_modules"))
        .add(resolveLocal("node_modules"))
        .end()
      .alias
        .set("@", api.resolve("appl"))
        .set("vue", // 'vue/dist/vue.esm')
          !options.runtimeCompiler
            ? "vue/dist/vue.esm.js"
            : "vue/dist/vue.runtime.esm.js"
        )
        .set("@", resolveAlias("appl"))
        .set("app", resolveAlias("appl/js/app"))
        .set("setglobals", resolveAlias("appl/js/utils/set.globals"))
        .set("basecontrol", resolveAlias("appl/js/utils/base.control"))
        .set("config", resolveAlias("appl/js/config"))
        .set("default", resolveAlias("appl/js/utils/default"))
        .set("helpers", resolveAlias("appl/js/utils/helpers"))
        .set("menu", resolveAlias("appl/js/utils/menu"))
        .set("pdf", resolveAlias("appl/js/controller/pdf"))
        .set("router", resolveAlias("appl/router"))
        .set("start", resolveAlias("appl/js/controller/start"))
        .set("setup", resolveAlias("appl/js/utils/setup"))
        .set("table", resolveAlias("appl/js/controller/table"))
        .set("tablepager", "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js")
        .set("tablewidgets", "tablesorter/dist/js/extras/jquery.tablesorter.widgets.min.js")
        .set("table", resolveAlias("appl/js/controller/table"))
        .set("apptests", resolveAlias("tests/apptest"))
        .set("contacttests", resolveAlias("tests/contacttest"))
        .set("domtests", resolveAlias("tests/domtest"))
        .set("logintests", resolveAlias("tests/logintest"))
        .set("routertests", resolveAlias("tests/routertest"))
        .set("toolstests", resolveAlias("tests/toolstest"))
        .set("dodextests", resolveAlias("tests/dodextest"))
        .set("inputtests", resolveAlias("tests/inputtest"))
        .set("handlebars", "handlebars/dist/handlebars.js");

    webpackConfig.resolveLoader
      .modules
        .add("node_modules")
        .add(api.resolve("node_modules"))
        .add(resolveLocal("node_modules"));

    webpackConfig.module
      .noParse(/^(vue|vue-router|vuex|vuex-router-sync)$/);

    // js is handled by cli-plugin-babel ---------------------------------------

    // vue-loader --------------------------------------------------------------
    const vueLoaderCacheConfig = api.genCacheConfig("vue-loader", {
      "vue-loader": require("vue-loader/package.json").version,
      /* eslint-disable-next-line node/no-extraneous-require */
      "@vue/component-compiler-utils": require("@vue/component-compiler-utils/package.json").version,
      "vue-template-compiler": require("vue-template-compiler/package.json").version
    });

    webpackConfig.module
      .rule("vue")
        .test(/\.vue$/)
        .use("cache-loader")
          .loader("cache-loader")
          .options(vueLoaderCacheConfig)
          .end()
        .use("vue-loader")
          .loader("vue-loader")
          .options(Object.assign({
            compilerOptions: {
              preserveWhitespace: false
            }
          }, vueLoaderCacheConfig));

    webpackConfig
      .plugin("vue-loader")
      .use(require("vue-loader/lib/plugin"));

    // static assets -----------------------------------------------------------

    webpackConfig.module
      .rule("images")
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use("url-loader")
          .loader("url-loader")
          .options(genUrlLoaderOptions("img"));

    // do not base64-inline SVGs.
    // https://github.com/facebookincubator/create-react-app/pull/1180
    webpackConfig.module
      .rule("svg")
        .test(/\.(svg)(\?.*)?$/)
        .use("file-loader")
          .loader("file-loader")
          .options({
            name: genAssetSubPath("img")
          });

    webpackConfig.module
      .rule("media")
        .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
        .use("url-loader")
          .loader("url-loader")
          .options(genUrlLoaderOptions("media"));

    // webpackConfig
    // .plugin('babel')
    // .use(require('cli-plugin-babel'))
    webpackConfig.module
      .rule("compile")
      .test(/\.(js)(\?.*)?$/i)
      .include
        .add(resolve("appl"))
        .add(resolve("tests"))
        .add(resolve(resolve("node_modules/webpack-dev-server/client")))
        .end()
      .use("babel")
      .loader("babel-loader");

    webpackConfig.module
      .rule("fonts")
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .use("url-loader")
          .loader("url-loader")
          .options(genUrlLoaderOptions("fonts"));

    // Other common pre-processors ---------------------------------------------

    webpackConfig.module
      .rule("pug")
      .test(/\.pug$/)
      .use("pug-plain-loader")
        .loader("pug-plain-loader")
        .end();

    // shims

    webpackConfig.node
      .merge({
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // process is injected via DefinePlugin, although some 3rd party
        // libraries may require a mock to work properly (#934)
        process: "mock",
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
      });

    const resolveClientEnv = require("../util/resolveClientEnv");
    webpackConfig
      .plugin("define")
        .use(require("webpack/lib/DefinePlugin"), [
          resolveClientEnv(options)
        ]);

    webpackConfig
      .plugin("case-sensitive-paths")
        .use(require("case-sensitive-paths-webpack-plugin"));

    // friendly error plugin displays very confusing errors when webpack
    // fails to resolve a loader, so we provide custom handlers to improve it
    const { transformer, formatter } = require("../util/resolveLoaderError");
    webpackConfig
      .plugin("friendly-errors")
        .use(require("friendly-errors-webpack-plugin"), [{
          additionalTransformers: [transformer],
          additionalFormatters: [formatter]
        }]);
  });
};
