
import "package.json!npm";
import steal from "@steal";
import App from "app";

//!steal-remove-start
/*
 * Startup live-reload in another window first - gulp hmr
 */
steal.import("live-reload").then(reload => {
//Only use outside of Karma 
    if (typeof testit === "undefined" || !testit) {
        reload("*", function () {
          //App reload of controllers
          App.controllers = [];
        });
    }
});
//!steal-remove-end

if(typeof testit !== "undefined") {
    window._bundler = "stealjs";
}
