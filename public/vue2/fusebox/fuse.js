const exec = require('child_process').exec;
const fs = require('fs');
const {
    FuseBox,
    QuantumPlugin,
    WebIndexPlugin,
    CSSPlugin,
    CSSResourcePlugin, 
    UglifyJSPlugin,
    HMRPlugin,
    EnvPlugin,
    VueComponentPlugin,
    BabelPlugin,
//    ReplacePlugin
    } = require("fuse-box");
const  BlockStripPlugin = require("./appl/js/plugin/BlockStrip").BlockStrip;
const  CopyFsPlugin = require("./appl/js/plugin/CopyFs").CopyFs;
const aliases = {
    "apptest": "../jasmine/apptest.js",
    "contacttest": "./contacttest.js",
    "domtest": "./domtest.js",
    "logintest": "./logintest.js",
    "routertest": "./routertest.js",
    "toolstest": "./toolstest.js",
    "app": "~/js/app",
    "config": "~/js/config",
    "default": "~/js/utils/default",
    "helpers": "~/js/utils/helpers",
    "pager": "tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js",
    "pdf": "~/js/controller/pdf",
    "menu": "~/js/utils/menu",
    "basecontrol": "~/js/utils/base.control",
    "setup": "~/js/utils/setup",
    "setglobals": "~/js/utils/set.globals",
    "setimports": "~/js/utils/set.imports",
    "start": "~/js/controller/start",
    "table": "~/js/controller/table",
    "handlebars": "handlebars/dist/handlebars.min.js",
    "vue": "vue/dist/vue.common.js",
    "@": ".."
};
//let value = !process.env.NODE_ENV ? EnvPlugin({NODE_ENV: 'development', USE_KARMA: 'false'}) : null;
let isKarma = process.env.USE_KARMA === "true";
let isProduction = process.env.NODE_ENV === 'production';
let distDir = isProduction ? "../dist/fusebox" : "../dist_test/fusebox";
let useQuantum = true;
let useHMR = process.env.USE_HMR === 'true';
let resources = (f) => (!isProduction && isKarma ? `/base/dist_test/fusebox/resources/${f}` : isProduction ? `../resources/${f}` : `/dist_test/fusebox/resources/${f}`);
let src = 'appl';

if (!isProduction && fs.existsSync('../.fusebox')) {
    exec('rm -r ../.fusebox');
}

const fuse = FuseBox.init({
//    experimentalFeatures: false,
    useTypescriptCompiler: !isProduction,
    allowSyntheticDefaultImports: true,
    plugins: [
//        isProduction && ReplacePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
        VueComponentPlugin({
            style: [
                CSSResourcePlugin({
                    dist: distDir + "/resources",
                    resolve: resources
                }),
                CSSPlugin()
            ]
        }),
        WebIndexPlugin({
            template: isProduction? "./appl/testapp.html": "./appl/testapp_dev.html",
            target: isProduction? "appl/testapp.html": "appl/testapp_dev.html",
        }),
        isProduction && useQuantum && QuantumPlugin({
            target: "browser",
            api: (core) => {
                core.solveComputed("moment/moment.js");
            },
            bakeApiIntoBundle: "vendor",
            uglify: true,
            treeshake: true,
            manifest: false
        }),
        isProduction && BabelPlugin({
            presets: ["env"]
        }),
        // ["node_modules/font-awesome/**.css",
        //     CSSResourcePlugin({
        //         dist: distDir + "/resources",
        //         resolve: resources
        //     }), CSSPlugin()
        // ],
        CSSPlugin(),
        CopyFsPlugin({
            copy: [{from: "appl/views/**/*", to: distDir + "/appl/views"},
                {from: "appl/templates/**/*", to: distDir + "/appl/templates"},
                {from: "appl/dodex/**/*", to: distDir + "/appl/dodex"},
                {from: "appl/index.html", to: distDir + "/"},
                {from: "index.html", to: distDir + "/"},
                {from: "images/*", to: distDir + "/images"},
                {from: "appl/assets/*", to: distDir + "/appl/assets"},
                {from: "../README.md", to: distDir}
            ]
        })
    ],
    homeDir: src,
    output: distDir + "/$name.js",
    log: true,
    debug: true,
    cache: !isProduction,
    hash: false,
    sourceMaps: isProduction && !isKarma,
    alias: aliases,
    allowJs: true,
    tsConfig: "tsconfig.json",
    shim: {
        jquery: {
            source: "../node_modules/jquery/dist/jquery.js",
            exports: "$",
        }
    }
});

if (!isProduction) {
    if (useHMR === true) {
        fuse.dev({
            root: '../',
            port: 3080,
            open: false
        });
    }
    var vendor = fuse.bundle("vendor")
            .target("browser")
            .instructions(`~ main.js`);

    var acceptance = fuse.bundle("acceptance") 
            .target("browser")
            .instructions(`> [main.js]`);

    if (useHMR === true) {
        acceptance.hmr({reload: true})
                .watch();
    }
} else {

    fuse.bundle('vendor')
            .target('browser')
            .sourceMaps(true)
            .instructions(`~ main.js`);

    fuse.bundle('acceptance') 
            .target('browser')
            .sourceMaps(false)
            .instructions(`!> [main.js]`)
            .plugin(BlockStripPlugin({
                options: {
                    start: 'develblock:start',
                    end: 'develblock:end'
            }}));
}

fuse.run();


