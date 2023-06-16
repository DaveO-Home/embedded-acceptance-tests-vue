# Changelog

## [v2.2.5](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.2.5) (2023-06-15)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/2.2.4...v2.2.5)

* Upgraded dependencies - koa server, vue3, vite, vue2
* Convertered (orm) bookshelf to objection.js for dodex server
* Major upgrade changes to vite.

## [v2.2.4](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.2.4) (2022-11-22)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/2.2.2...v2.2.4)

* Upgraded dependencies - eliminated many vulnerablilities
    * acceptance-tests-vue/ - koa/knex/bookshelf/sqlite3 updates
    * acceptance-tests-vue/public - upgrades for bundlers/tools
    * acceptance-tests-vue/vite - upgrades to testing tools
    * acceptance-tests-vue/vue2 - upgrades to bundlers/tools

## [v2.2.2](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.2.2) (2022-02-24)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/2.2,1...v2.2.2)

* Upgraded parcel -> 2.3.2
* Custom @metahubt/karama-jasmine-jquery to remove deprecations
* Fixed vite failing test - pageload.spec.js
* Upgraded vite dependencies

## [v2.2.1](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.2.1) (2022-02-21)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/2.2,0...v2.2.1)

* Upgraded dependencies
* Fixed Webpack Config
* Still having issues with Parcel 2, stuck at 2.0.1

## [v2.2.0](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.2.0) (2022-02-15)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/master...v2.2.0)

* Upgraded dependencies
* Added dodex message server as the dev server - dodex message client should work out of the box.
* Changed bootstap layout

## [v2.1.1](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.1.1) (2021-11-22)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/2.1.0...v2.1.1)

* Added hack to fix bootstrap modal in Vite. Copied bootstrap.esm.js into app.

## [v2.1.0](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/tree/v2.1.0) (2021-11-22)

[Full Changelog](https://github.com/DaveO-Home/embedded-acceptance-tests-vue/compare/master...v2.1.0)

* Upgraded dependencies
* Now using Bootstrap 5
* Changed html to reflect new Bootstrap 5 code
* Removed external css for SPA - designed with Bootstrap 5
* Upgraded Webpack-Dev-Server to v4 - configuration changes
* Added esbuild bundler for V3
