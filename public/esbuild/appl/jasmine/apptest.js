import routerTest from "./routertest";
import domTest from "./domtest";
import toolsTest from "./toolstest";
import contactTest from "./contacttest";
import loginTest from "./logintest";
import dodexTest from "./dodextest";
import inputTest from "./inputtest";
import Start from "../js/controller/start";
import Route from "../js/router";
import Helpers from "../js/utils/helpers";
import { timer } from "rxjs";
import dodex from "dodex";
import input from "dodex-input";
import mess from "dodex-mess";

export default function (App, dodexApp, login, sidebar, content, footer) {
    describe("Application Unit test suite - AppTest", () => {
        beforeAll(() => {
            // Add html to karma page for visual tdd
            $("body").prepend(layout());
            dodexApp._component.router.isReady()
                .then(() => {
                    dodexApp.mount("#dodex");
                    login.mount("#login");
                    sidebar.mount("#sidebar");
                    content.mount("#content");
                    footer.mount("#footer");
                }).catch(e => console.error(e));

            spyOn(App,"loadView").and.callThrough();
            spyOn(Helpers, "isLoaded").and.callThrough();
        }, 4000);

        afterEach(() => {
            // $(vueContent.querySelector("#data")).empty();
        });

        afterAll(() => {
            $("body").remove();
        }, 4000);

        it("Is Welcome Page Loaded", done => {
            /*
             * Loading Welcome page.
             */
            Route.push({ name: "HelloWorld" });
            Route.push({ name: "start" });

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, content, "data", 0, 1);
            }).then(() => {
                
                expect(App.controllers["Start"]).not.toBeUndefined();
                
                // Vue3 is async so we need next tick
                setTimeout(function() {
                    expect(App.loadView).toHaveBeenCalled();
                    expect(Helpers.isLoaded.calls.count()).toEqual(1);
                    expect(document.querySelector("#content").children.length > 1).toBe(true);
                    domTest("index");
                    done();
                }, 500);
            }).catch(rejected => {
                fail(`The Welcome Page did not load within limited time: ${rejected}`);
            });
        });

        it("Is Tools Table Loaded", done => {
            /*
             * Letting the Router load the appropriate page.
             */
            Route.push({ name: "tools" });

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, content, "data", 0, 1);
            }).then(() => {
                expect(App.controllers["Table"]).not.toBeUndefined();

                setTimeout(function() {
                    expect(document.querySelector("#data").children.length > 1).toBe(true);
                    domTest("tools");
                    done();
                }, 0);
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`);
            });
        });

        routerTest(dodexApp._component.router.getRoutes(), "table", "tools", null);

        it("Is Pdf Loaded", done => {
            Route.push({ name: "test" });

            const numbers = timer(50, 50);
            const observable = numbers.subscribe(timer => {
                let pdf = document.querySelector("#main_container").querySelector("[name='pdfDO']");
                if (pdf || timer === 50) {
                    expect(document.querySelector("#main_container").querySelector("iframe") !== null).toBe(true);
                    observable.unsubscribe();
                    setTimeout(function() {
                        domTest("pdf");
                        done();
                    }, 0);
                }
            });
        });

        // routerTest(vm.$router.options.routes, "pdf", "test", null);
        routerTest(dodexApp._component.router.getRoutes(), "pdf", "test", null);

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(Route, Helpers, content, timer);
        // Form Validation
        contactTest(Route, Helpers, content, timer);
        // Verify modal form
        loginTest(Start, timer);
        // Test dodex
        dodexTest(dodex, input, mess, getAdditionalContent(), Start, timer);
        // Test dodex input
        inputTest(dodex, timer);

        if (testOnly) {
            it("Testing only", () => {
                fail("Testing only, build will not proceed");
            });
        }
    });
}

function getAdditionalContent() {
    return {
        cards: {
            card28: {
                tab: "F01999", // Only first 3 characters will show on the tab.
                front: {
                    content: `<h1 style="font-size: 10px;">Friends</h1>
					<address style="width:385px">
						<strong>Charlie Brown</strong> 	111 Ace Ave. Pet Town
						<abbr title="phone"> : </abbr>555 555-1212<br>
						<abbr title="email" class="mr-1"></abbr><a href="mailto:cbrown@pets.com">cbrown@pets.com</a>
					</address>
					`
                },
                back: {
                    content: `<h1 style="font-size: 10px;">More Friends</h1>
					<address style="width:385px">
						<strong>Lucy</strong> 113 Ace Ave. Pet Town
						<abbr title="phone"> : </abbr>555 555-1255<br>
						<abbr title="email" class="mr-1"></abbr><a href="mailto:lucy@pets.com">lucy@pets.com</a>
					</address>
					`
                }
            },
            card29: {
                tab: "F02",
                front: {
                    content: "<h1 style=\"font-size: 14px;\">My New Card Front</h1>"
                },
                back: {
                    content: "<h1 style=\"font-size: 14px;\">My New Card Back</h1>"
                }
            }
        }
    };
}

function layout() {
    return `<body class="d-flex flex-column vh-100 overflow-hidden body-bg">
    <nav id="top-nav" class="navbar navbar-expand-sm navbar-light fixed-top rounded nav-bar-bg">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Test</a>
            <ul class="navbar-nav me-auto mb-md-0">
                <div id="dodex"></div>
            </ul>
            <div id="login"></div>
        </div>
    </nav>
    <main class="container-fluid pb-1 flex-grow-1 d-flex flex-column flex-sm-row overflow-auto">
        <div class="row flex-grow-sm-1 flex-grow-0 w-100">
            <div class="col-sm-2 flex-grow-sm-1 flex-shrink-1 flex-grow-0 pb-sm-0 pb-3">
                <div class="bg-light border rounded-3 p-1 h-100">
                    <h6 class="d-none d-sm-block text-muted">Views</h6>
                    <ul class="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
                        <div id="sidebar"></div>
                    </ul>
                </div>
            </div>
            <div class="col-sm overflow-auto h-100">
                <div class="page-bg border rounded-3 p-3">
                    <div id="container"></div>
                    <div id="main_container">
                        <div class="loading-page"></div>
                        <span>
                            <div id="content"></div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <footer class="footer py-lg-3 bg-light">
        <div class="container">
            <span class="ml-lg-3 small text-muted">Karma, Jasmine, Parcel and Vue Acceptance Test and Build
                Demo</span>
            <span class="contact float-end">
                <div id="footer"></div>
            </span>
        </div>
    </footer>

    <div id="jsoneditor" class="editor" style="z-index: -1"></div>`;
}
