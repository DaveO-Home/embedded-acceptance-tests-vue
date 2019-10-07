import routerTest from "b/routertest";
import domTest from "b/domtest";
import toolsTest from "b/toolstest";
import contactTest from "b/contacttest";
import loginTest from "b/logintest";
import Start from "b/start";
import Route from "../router";
import Helpers from "b/helpers";
import { timer } from "rxjs";

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

        if (testOnly) {
            it("Testing only", () => {
                fail("Testing only, build will not proceed");
            });
        }
    });
}
