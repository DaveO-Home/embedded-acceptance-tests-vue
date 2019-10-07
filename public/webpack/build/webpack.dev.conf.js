
const path = require("path");
const merge = require("webpack-merge");
const utils = require("./utils");
const config = require("../config");
const webpack = require("webpack");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin')
//const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// const portfinder = require('portfinder')

const isWatch = process.env.USE_WATCH === "true";
const devPublicPath = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "/dist_test/webpack/";

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

baseWebpackConfig.output.publicPath = devPublicPath;

const devWebpackConfig = merge(baseWebpackConfig, {
    
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: "warning",
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: path.join(config.dev.assetsPublicPath, "index.html")}
            ]
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
                ? {warnings: false, errors: true}
        : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": require("../config/dev.env")
        }),
//        new webpack.HotModuleReplacementPlugin(),
//        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
//        new HtmlWebpackPlugin({
//            filename: 'index.html',
//            template: 'index.html',
//            inject: false
//        }),
        new ExtractTextPlugin({
            filename: "[name].bundle.css",
            disable: false,
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ["popper.js", "default"]
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "../static"),
                to: config.dev.assetsSubDirectory,
                ignore: [".*"]
            },
            {from: "../images/favicon.ico", to: "images"},
            {from: "./appl/testapp_dev.html", to: config.dev.assetsSubDirectory},
            {from: "./appl/index.html", to: config.dev.assetsSubDirectory},
            {from: "../README.md", to: "../"},
            {from: {
                    glob: "./appl/views/**/*",
                    dot: false
                },
                to: ""},
            {from: {
                    glob: "./appl/templates/**/*",
                    dot: false
                },
                to: ""}
        ])
    ],
    watch: isWatch,
    watchOptions: {
        ignored: /node_modules/
    }
});

module.exports = devWebpackConfig;

//module.exports = new Promise((resolve, reject) => {
//  portfinder.basePort = process.env.PORT || config.dev.port
//  portfinder.getPort((err, port) => {
//    if (err) {
//      reject(err)
//    } else {
//      // publish the new Port, necessary for e2e tests
//      process.env.PORT = port
//      // add port to devServer config
//      devWebpackConfig.devServer.port = port
//
//      // Add FriendlyErrorsPlugin
//      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//        compilationSuccessInfo: {
//          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//        },
//        onErrors: config.dev.notifyOnErrors
//        ? utils.createNotifierCallback()
//        : undefined
//      }))
//
//      resolve(devWebpackConfig)
//    }
//  })
//})
