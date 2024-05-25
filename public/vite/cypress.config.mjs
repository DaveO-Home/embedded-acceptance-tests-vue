import vitePreprocessor from "cypress-vite";
import { defineConfig } from "cypress";
import webpackConfig from "./cypress/webpack.dev.conf.mjs";

//const vitePreprocessor = require("cypress-vite");
//const { defineConfig } = require("cypress");
//const webpackConfig = require("./cypress/webpack.dev.conf");

//module.exports = defineConfig({
 export default defineConfig({
  projectId: 'jweaaw',
  env: {
    DEBUG: "cypress:webpack:stats",
  },

  support: false,
  video: false,

  e2e: {
    setupNodeEvents(on) {
      on("file:preprocessor", vitePreprocessor());
    },
    //    setupNodeEvents(on, config) {
    //      return require('./cypress/plugins/index.js')(on, config)
    //    },
    baseUrl: "http://localhost:4080",
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",
    testIsolation: false,
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "webpack",
      webpackConfig: webpackConfig,
    },
  },
});
