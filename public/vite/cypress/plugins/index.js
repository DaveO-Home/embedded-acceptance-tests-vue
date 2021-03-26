const webpackPreprocessor = require("cypress-webpack-preprocessor-v5");
const webpackConfig = require("../webpack.dev.conf.js");

const options = {
    webpackOptions: webpackConfig,
    watchOptions: {},
  };

module.exports = (on) => {
  on("file:preprocessor", webpackPreprocessor(options));
};
