import routerTest from "./routertest";
import domTest from "./domtest";
import toolsTest from "./toolstest";
import contactTest from "./contacttest";
import loginTest from "./logintest";
import Start from "../js/controller/start";
import Route from "../js/router";
import Helpers from "../js/utils/helpers";
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
        }, 4000);

        afterEach(() => {
            $(vueElement.querySelector("#data")).empty();
        });

        afterAll(() => {
            $(vueElement).remove();
        }, 4000);

        it("Is Welcome Page Loaded", done => {
            /*
             * Loading Welcome page.
             */
            Route.push({ name: "start" });

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, vm, "data", 0, 1);
            }).then(() => {
                //                expect(App.loadView).toHaveBeenCalled()
                //                expect(Helpers.isLoaded.calls.count()).toEqual(1)
                expect(App.controllers["Start"]).not.toBeUndefined();
                expect(vueElement.querySelector("#data").children.length > 3).toBe(true);

                domTest("index", vueElement);
                done();
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
                Helpers.isResolved(resolve, reject, vm, "data", 0, 1);
            }).then(() => {
                // $('body').append(vueElement)
                expect(App.controllers["Table"]).not.toBeUndefined();
                expect(vueElement.querySelector("#data").children.length > 1).toBe(true);

                domTest("tools", vueElement);
                done();
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`);
            });
        });

        routerTest(vm.$router.options.routes, "table", "tools", null);

        it("Is Pdf Loaded", done => {
            Route.push({ name: "test" });

            const numbers = timer(50, 50);
            const observable = numbers.subscribe(timer => {
                let pdf = vm.$el.querySelector("#main_container").querySelector("[name='pdfDO']");
                if (pdf || timer === 50) {
                    expect(vueElement.querySelector("#main_container").querySelector("iframe") !== null).toBe(true);
                    observable.unsubscribe();
                    domTest("pdf", vueElement);
                    done();
                }
            });
        });

        routerTest(vm.$router.options.routes, "pdf", "test", null);

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(Route, Helpers, vm, timer);
        // Form Validation
        contactTest(Route, Helpers, vm, timer);
        // Verify modal form
        loginTest(Start, timer);

        if (testOnly) {
            it("Testing only", () => {
                fail("Testing only, build will not proceed");
            });
        }
    });
}
