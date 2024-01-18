import jQuery from "jquery";
window.jQuery = window.$ = jQuery;

window._bundler = "parcel";

if (process.env.NODE_ENV === "development" || typeof testit !== "undefined" && testit) {
   window.globalThis.__VUE_OPTIONS_API__ = true
   window.globalThis.__VUE_PROD_DEVTOOLS__ = true;
   window.globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
} else {
   // different values for production.
   window.globalThis.__VUE_OPTIONS_API__ = false;
   window.globalThis.__VUE_PROD_DEVTOOLS__ = false;
   window.globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
}
