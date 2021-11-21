# Vue Embedded Acceptance Testing with Karma and Jasmine

The basic idea is to build a production application ensuring consistent and stable code using JavaScript, CSS and bootstrap linting and automated unit and e2e testing. This will be in part, assisted by the development tools, detailed in the [Development Overview](#vue-development) and bundle sections. Parcel, Rollup and Webpack now use Vue 3. The Vue 2 bundlers are located in `public/vue2`. Vite was added for vue3 and is located in `public/vite`.

[Production Build](#vue-production-build)

[Test Build](#vue-test-build)

[Development Overview](#vue-development)

## Bundle Tools

> 1. [Browserify](#vue-i-browserify)
> 1. [Brunch](#vue-ii-brunch)
> 1. [esbuild](#vue-iii-esbuild)
> 1. [Fusebox](#vue-iv-fusebox)
> 1. [Parcel](#vue-v-parcel)
> 1. [Rollup](#vue-vi-rollup)
> 1. [Steal](#vue-vii-stealjs)
> 1. [Webpack](#vue-viii-webpack)
> 1. [Vite](#vue-ix-vite)

[Installation](#vue-installation)

[Docker](#vue-x-dockerfile)

**Dodex**: Added for testing and demo. <https://github.com/DaveO-Home/dodex>

## Other Framworks

  1. **Canjs** - <https://github.com/DaveO-Home/embedded-acceptance-tests>
  1. **Angular** - <https://github.com/DaveO-Home/embedded-acceptance-tests-ng>
  1. **React** - <https://github.com/DaveO-Home/embedded-acceptance-tests-react>

**Dockerfile**: See instructions at bottom of README.

## Main Tools

  1. Gulp
  1. Karma
  1. Jasmine
  1. Any Browser with a karma launcher
  1. Javascript bundling tools
  1. See `public/package.json` for details
  1. Node, npm - node v10 or greater works best
  1. Vite/Cypress

## Vue Installation

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

**Desktop:**

`Clone the repository or download the .zip`

**Install Assumptions:**

  1. OS Linux or Windows(Tested on Windows10)
  1. Node and npm
  1. Gulp4 is default - If your global Gulp is version 3, you can execute `npx gulp` from the build directories.
  1. Google Chrome
  1. Firefox

**Server:**

  `cd` to top level directory `<install>/acceptance-tests-vue`

```bash
  npm install or npm install --force
```

  This will install a small Node/Koa setup to view the results of a production/test builds.

  `cd <install>/acceptance-tests-vue/public`

```bash
  npm install or npm install --force
```

  To install required dependencies. Currently this will install Vue3 for Parcel, Rollup and Webpack.

  `cd <install>/acceptance-tests-vue/public/vue2`

  To install required dependencies for Browserify, Brunch, FuseBox and Stealjs for Vue2. If trying Brunch, install the global package for Brunch, `npm install brunch -g`.

  __Note;__ To fix many of the javascript vulnerabilities, execute `npm audit fix`.

**Client:**

Test builds will generate bundles in `dist_test` and production in the `dist` directory at the root level, `public` for Vue3 bundlers. The distribution directories for Vue2 are under the `public/vue2` directory.

## Vue Production Build

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

To generate a build "cd to `public/<bundler>/build` and type `gulp`, e.g.

```bash
  cd public/parcel/build
  gulp
```

If the tests succeed then the build should complete.

To run the production application:

  1. `cd <install>/acceptance_tests-vue`
  1. `npm start`  -  This should start a Node Server with port 3080.
  1. Start a browser and enter `localhost:3080/dist/<bundler>/appl/testapp.html`
  1. For the vue2 versions, the Production Url is `localhost:3080/vue2/dist/<bundler>/testapp.html`

You can repeat the procedure with "webpack", "browserify", "stealjs", "brunch", "parcel" or "rollup". Output from the build can be logged by setting the environment variable `USE_LOGFILE=true`.

Normally you can also run the test bundles(dist_test) from the node koa server. However, when switching between development karma testing and running the test(dist_test) application, some resources are not found because of the "base/dist_test" URL. To fix this run `gulp rebuild` from the `<bundler>/build` directory.

## Vue Test Build

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

The test build simply runs the tests in headless mode. The default browsers are ChromeHeadless and FirefoxHeadless.  To change the default you can set an environment variable; e.g.

```bash
  export USE_BROWSERS=ChromeHeadless,Opera
```

to remove FirefoxHeadless from the browser list and add Opera.  You can also set this environment variable for a production build.

To run the tests "cd to `public/<bundler>/build` or `public/vue2/<bundler>/build` and type `gulp test`, e.g.

```bash
  cd public/webpack/build
  gulp test
```

A test result might look like;

```text
  Suite for Unit Tests
    ✔ Verify that browser supports Promises
    ✔ ES6 Support
    ✔ blockStrip to remove Canjs block of code
  Unit Tests - Suite 2
    ✔ Is Karma active
    ✔ Verify NaN
  Popper Defined - required for Bootstrap
    ✔ is JQuery defined
    ✔ is Popper defined
  Application Unit test suite - AppTest
    ✔ Is Welcome Page Loaded
    ✔ Is Tools Table Loaded
    Test Router: table/tools
      ✔ controller set: table
      ✔ action set: tools
      ✔ dispatch called: table
    ✔ Is Pdf Loaded
    Test Router: pdf/test
      ✔ controller set: pdf
      ✔ action set: test
      ✔ dispatch called: pdf
    Load new tools page
      ✔ setup and change event executed.
      ✔ new page loaded on change.
    Contact Form Validation
      ✔ Contact form - verify required fields
      ✔ Contact form - validate populated fields, email mismatch.
      ✔ Contact form - validate email with valid email address.
      ✔ Contact form - validate form submission.
    Popup Login Form
      ✔ Login form - verify modal with login loaded
      ✔ Login form - verify cancel and removed from DOM
    Dodex Operation Validation
      ✔ Dodex - loaded and toggle on icon mousedown
      ✔ Dodex - Check that card A is current and flipped on mousedown
      ✔ Dodex - Check that card B is current and flipped on mousedown
      ✔ Dodex - Flip cards A & B back to original positions
      ✔ Dodex - Flip multiple cards on tab mousedown
      ✔ Dodex - Add additional app/personal cards
      ✔ Dodex - Load Login Popup from card1(A)
    Dodex Input Operation Validation
      ✔ Dodex Input - popup on mouse double click
      ✔ Dodex Input - Verify that form elements exist
      ✔ Dodex Input - verify that uploaded file is processed
      ✔ Dodex Input - close popup on button click

Finished in 13.883 secs / 9.677 secs @ 13:26:11 GMT-0800 (PST)

SUMMARY:
✔ 72 tests completed
```

## Vue Development

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

__Note__; When modifying project assets(.handlebars, .html, etc.) you can execute `gulp copy` from the `public/<bundler>/build` or `public/vue2/<bundler>/build` directory to preview changes. This is not required for __StealJs__.

__A word on developing tests__; You can write and execute tests quicker by using the rebuild process of a given bundler and running the `acceptance` gulp task after the auto-rebuild, e.g. with __Rollup__ you can;

* `cd public/rollup/build`
* `gulp watch`
* Develop or modify a test.
* In another window execute `gulp acceptance` from the `build` directory to view the modified or new test results.

  __Also Note__; With a few of the bundle tools, execute the `gulp development` task to run from one window.

### Vue I. **Browserify**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Development Server Window*** -

* `cd public/vue2/browserify/build`
* `gulp server`

   Browsersync will start a browser tab(default Chrome) with `localhost:3080/vue2/dist_test/browserify/appl/testapp_dev.html`.  Any changes to the source code(*.js files) should be reflected in the browser auto reload.

2\. ***Hot Module Reload(HMR) Window*** -

* `cd public/vue2/browserify/build`
* `gulp hmr`

   The `watchify` plugin will remain active to rebuild the bundle on code change.

3\. ***Test Driven Development(tdd) Window*** -

* `cd public/vue2/browserify/build`
* `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.  Note, you do not need `hmr` active for `tdd`. Also, `tdd` can be run with a headless browser.

### Vue II. **Brunch**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Watch, Recompile and Reload Window*** -

* `cd public/vue2/brunch/build`
* `gulp watch` or `./cook watch` (output formatted better)

At this point you can start a browser and enter `localhost:3080/appl/testapp_dev.html`. Any changes to the source code(*.js files and other assets such as*.html) should be reflected in the browser auto reload.

__Note__; The test url is `localhost:3080` since Brunch by default uses 'config.paths.public' as the server context. Also, the reload may fail at times, I've noticed that making a second code mod re-rights the ship.

2\. ***Test Driven Development(tdd) Window*** -

* `cd public/vue2/brunch/build`
* `gulp tdd` or `./cook tdd`

  While the Brunch watcher is running, tests are re-run when code are changed.
  
  __Note__; tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

3\. ***Special Considerations***
  
* Brunch plugin eslint-brunch uses eslint 3. The demo/vue uses version 4.  The `gulp`(production build) command uses a gulp linter, so javascript linting is executed. However, if you wish to use the Brunch eslint-brunch plugin, do the following;
  * `cd <install>/public/vue2/node_modules/eslint-brunch`
  * `npm install eslint@latest`
  * `cd <install>/public/vue2` and edit the `brunch-config.js` file and uncomment the eslint section.

### Vue III. **esbuild**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Hot Module Reload(HMR) Server Window*** -

* `cd public/esbuild/build`
* `gulp hmr`
* HMR will start a web server with port 3080, a watcher will also start that rebuilds the bundle on code change.

  HMR is using `browser-sync` so a web page will start at: `localhost:3080/dist_test/esbuild/appl/testapp_dev.html`.  Any changes to the source code(\*.js|*.jsx) files should be reflected in the browser auto reload. Also, the browser will reload when changing static content by executing `gulp copy`.

  For development and testing, the normal tasks; `gulp test`, `gulp acceptance`, `gulp rebuild` can be executed when needed.

2\. ***Test Driven Development(tdd) Window*** -

* `cd public/esbuild/build`
* `gulp tdd`

  You must use `gulp build` and not gulp rebuild with `gulp tdd` running. Tdd will fail with gulp rebuild because it cleans the test directory.

  The HMR Server must be running if you want tests to rerun as source code(*.js) are changed. Note, tests can be added or 
  removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### Vue IV. **Fusebox**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Hot Module Reload(HMR) Server Window*** -

* `cd public/vue2/fusebox/build`
* `gulp hmr` or `fuse hmr`

   At this point you can start a browser and enter `localhost:3080/vue2/fusebox/appl/testapp_dev.html`.  Any changes to the source code(*.js files) should be reflected in the browser auto reload.

2\. ***Test Driven Development(tdd) Window*** -

* `cd public/vue2/fusebox/build`
* `gulp tdd`

   The HMR Server must be running if you want tests to rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`. A warning is issued under `tdd`(404: /dist_test/fusebox/resources) since `hmr` requires a non-karma build, this can be ignored.

### Vue V. **Parcel**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Watch, Recompile and Reload Window*** -

* `cd public/parcel/build`
* `gulp watch` or `gulp serve`

At this point you can start a browser and enter `localhost:3080/dist_test/parcel/appl/testapp_dev.html` (can be configured to auto open browser tab). Any changes to the source code(*.js and*.css files) should be reflected in the browser auto reload. __Note;__ With `parcel V2`, the parcel internal server is used. To allow the same test URL, a proxy has been added using `.../public/.proxyrc`. The HMR reload seems to have a problem, you may need to reload the browser manually.

2\. ***Test Driven Development(tdd) Window*** -

* `cd public/parcel/build`
* `gulp tdd`

  While the Parcel watcher is running, tests are re-run when code are changed.
  
  * Using `export USE_BUNDLER=false` - When using `gulp watch & gulp tdd` together, you can set USE_BUNDLER to false to startup TDD without building first, `gulp watch` does the test build.  Also, by settting `USE_BUNDLER=false` before `gulp`(production build), only testing and linting will execute.

  __Note__; tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### Vue VI. **Rollup**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Development Server Window*** -

* `cd public/rollup/build`
* `gulp watch`

   The Rollup Development Server, Watch(auto-rebuild) and Page Reload functions are started together.  Simply use the following URL in any browser; `localhost:3080/dist_test/rollup/appl/testapp_dev.html`.

2\. ***Test Driven Development(tdd) Window*** -

* `cd public/rollup/build`
* `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### Vue VII. **Stealjs**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Development Server Window*** -

* `cd public/vue2/stealjs/build`
* `gulp server`

2\. ***Live-Reload(HMR) Window*** -

* `cd public/stealjs/build`
* `gulp hmr`

   At this point you can start a browser and enter `localhost:3080/vue2/stealjs/appl/testapp_dev.html`(please note that dist_test is not in the URL).  Any changes to the source code(*.js files) should be reflected in the browser auto reload.  The `gulp hmr` by default builds a vendor bundle for faster reload.  When you are not modifying the node_modules directory, subsequent executions of `gulp hmr` do not need the vendor bundle build. You can disable by setting an environment variable, `export USE_VENDOR_BUILD=false`.

   Stealjs does not require a dist_test build. It runs development directly from the source(nice!). However, when starting `hmr` a vendor bundle is produced at public/dev-bundle.js for `hmr` performance. The bundle is accessed from the `testapp_dev.html` page, via a `deps-bundle` attribute.

3\. ***Test Driven Development(tdd) Window*** -

* `cd public/vue2/steal/build`
* `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### Vue VIII. **Webpack**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1\. ***Development HMR Server Window*** -

* `cd public/webpack/build`
* `gulp hmr`
  
  This will start a server and watcher. View the application in a browser using URL `localhost:3080/dist_test/webpack/appl/testapp_dev.html`. Any code changes should be reflected in the auto reload.

2\. ***Hot Module Reload(Watch) Window*** -

* `cd public/webpack/build`
* `gulp watch`

   This rebuilds the application. If a server in running, e.g. `npm start` in `<install>/acceptance_tests-vue`, a manual refresh will reflect the change when executing `localhost:3080/dist_test/webpack/appl/testapp_dev.html`.

3\. ***Test Driven Development(tdd) Window*** -

* `cd public/webpack/build`
* `gulp tdd`

   Tests will rerun as source code(*.js) is changed. Note, tests can be added or removed as code is developed. Both Chrome and Firefox are the default browsers. This can be overridden with an environment variable, `export USE_BROWSERS=Opera`.

### Vue IX. **Vite**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

1. Vite is loacated in the `public/vite` directory.
2. The vite setup does not use `gulp` rather it uses `npm` scripts, see `vite/package.json`.
3. To install, execute `npm install` or `npm install --legacy-peer-deps (--force)` in both `<install dir>/public` and `<install dir>/public/vite`.

***Production*** -

1. Execute `npm run prod` to run full testing, linting and build. (`Cypress` and `Karma` testing)
2. Execute `npm run build` to build without the tests. The build is located in `vite/dist`.
3. Execute `npm start` from the main install directory to run the `Koa` server and use Url `localhost:3080/vite/dist/index.html`.
4. You can also use `npm run serve` from the `Vite` directory to start a server at port 5000. However you  will need to use the `Network host` displayed in the terminal. Running production from the dev server, `npm run dev` with Url `localhost:4080/dist/index.html` may work.
5. Execute `npm copy` to recopy static files to the `dist` directory.
6. Execute `npm run integration` to run `karma` embedded tests. __Note;__ The `karma` tests run against the production build.
7. Execute `npm run integrationp` to run the `karma` test against an existing production bundle.

__Note:__ Vite has an issue with `bootstrap 5` and jQuery. The `modal (jQuery.fn)` fails in production mode.

***Developemnt*** -

1. Exeucte `npm run dev` to start the development server. Code changes will be reflected in the browser at `localhost:4080`. __Note;__ `npm run dev` executes `vite` and dynamically setups up the application via modules, no bundles are created. Good for large applications.
2. Execute `npm run tdd` to start up both the `dev` server and `cypress` to run test driven development. This will also reload the browser at `localhost:4080`.
3. Execute `npm run acceptance` to run all of the defined `cypress` tests in the e2e directory.
4. Execute `npm run lint` to lint the application(js and vue) files.

### Vue X. **Dockerfile**

[Top](#vue-embedded-acceptance-testing-with-karma-and-jasmine)

You can build a complete test/develpment environment on a Docker vm with the supplied Dockerfile.

**Linux as Parent Host**(assumes docker is installed and daemon is running)-

In the top parent directory, usually `..../embedded-acceptance-tests-vue/` execute the following commands;

1\. ```docker build -t embedded fedora``` or ```docker build -t embedded centos```

2\. ```docker run -ti --privileged  -p 3080:3080 -e DISPLAY=$DISPLAY  -v /tmp/.X11-unix:/tmp/.X11-unix --name test_env embedded bash```

You should be logged into the test container(test_env). There will be 4 embedded-acceptance-tests* directories. Change into to default directory defined in the Dockerfile, for example canjs(embedded-acceptance-tests/public). All of the node dependencies should be installed, so ```cd``` to a desired bundler build directory, i.e. ```stealjs/build``` and follow the above instructions on testing, development and production builds.

3\. When existing the vm after the ```docker run``` command, the container may be stopped. To restart execute ```docker start test_env``` and then ```docker exec -it --privileged --user tester -e DISPLAY=$DISPLAY -w /home/tester test_env bash```.  You can also use ```--user root``` to execute admin work.

**Windows as Parent Host**-

For Pro and Enterpise OS's, follow the Docker instructions on installation.  For the Home OS version you can use the legacy **Docker Desktop** client. It is best to have a Pro or Enterpise Windows OS to use a WSL(Windows bash) install. Use following commands with Windows;

1\. ```docker build -t embedded fedora``` or ```docker build -t embedded centos```

2\. ```docker run -ti --privileged  -p 3080:3080 --name test_env embedded bash```

3\. ```docker exec -it --privileged --user tester -w /home/tester test_env bash```

The web port 3080 is exposed to the parent host, so once an application is sucessfully bundled and the node server(```npm start``` in directory embedded-acceptance-tests) is started, a host browser can view the application using say ```localhost:3080/dist/webpack/appl/testapp.html```.

__Note__; Without a complete Pro/Enterprise docker installation, the ```test_env``` container can only run with Headless browsers. Therfore you should execute ```export USE_BROWSERS=ChromeHeadless,FirefoxHeadless``` before testing, development and building.
