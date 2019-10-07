
import handlebars from "handlebars";
import Menu from "menu";
import steal from "@steal";
//let handebars = {}
window.Stache = handlebars;
window._bundler = "stealjs";
export default {
    init () {
        steal.done().then(function () {
            // Show the page
            $("#top-nav").removeAttr("hidden");
            $("#side-nav").removeAttr("hidden");
            Menu.activate("#top-nav div ul li");
            Menu.activate("#side-nav nav ul li");
        });
    }
};
