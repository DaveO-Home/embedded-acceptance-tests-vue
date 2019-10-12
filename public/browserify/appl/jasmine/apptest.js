import routerTest from "b/routertest";
import domTest from "b/domtest";
import toolsTest from "b/toolstest";
import contactTest from "b/contacttest";
import loginTest from "b/logintest";
import dodexTest from "./dodextest";
import inputTest from "./inputtest";
import Start from "b/start";
import Route from "../router";
import Helpers from "b/helpers";
import { timer } from "rxjs";
import dodex from "dodex";
import input from "dodex-input";
import mess from "dodex-mess";

export default function (App, vm) {
    const vueElement = vm.$el;

    describe("Application Unit test suite - AppTest", () => {
        beforeAll(() => {
            // Add virtual dom to karma page
            $("body").append(vueElement);
            /*
             * Jasmine spyOn fails with Vue
             */
//             spyOn(App, 'loadView').and.callThrough()
//             spyOn(Helpers, 'isLoaded').and.callThrough()
        }, 10000);

        afterEach(() => {
            $(vueElement.querySelector("#data")).empty();
        });

        afterAll(() => {
            $(vueElement).remove();
        });

        it("Is Welcome Page Loaded", done => {
            /*
             * Loading Welcome page.
             */
            Route.push({name: "start"});
            
            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, vm, "data", 0, 1);
            }).catch(rejected => {
                fail(`The Welcome Page did not load within limited time: ${rejected}`);
            }).then(() => {
//                expect(App.loadView).toHaveBeenCalled()
//                expect(Helpers.isLoaded.calls.count()).toEqual(1)
                expect(App.controllers["Start"]).not.toBeUndefined();
                expect(vueElement.querySelector("#data").children.length > 3).toBe(true);

                domTest("index", vueElement);
                done();
            });
        });

        it("Is Tools Table Loaded", done => {
            /*
             * Letting the Router load the appropriate page.
             */
            Route.push({name: "tools"});

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, vm, "data", 0, 1);
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`);
            }).then(() => {
                // $('body').append(vueElement)
                expect(App.controllers["Table"]).not.toBeUndefined();
                expect(vueElement.querySelector("#data").children.length > 1).toBe(true);

                domTest("tools", vueElement);
                done();
            });
        });

        routerTest(vm.$router.options.routes, "table", "tools", null);

        it("Is Pdf Loaded", done => {
            Route.push({name: "test"});

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, vm, "main_container", 0, 1);
            }).catch(rejected => {
                fail(`The Pdf Page did not load within limited time: ${rejected}`);
            }).then(() => {
                expect(vueElement.querySelector("#main_container").children.length > 1).toBe(true);

                domTest("pdf", vueElement);
                done();
            });
        });

        routerTest(vm.$router.options.routes, "pdf", "test", null);

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(Route, Helpers, vm, timer);
        // Form Validation
        contactTest(Route, Helpers, vm);
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
