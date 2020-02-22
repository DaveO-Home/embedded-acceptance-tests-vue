export default function (Route, Helpers, vm, timer) {
    /*
     * Test that new data are loaded when the select value changes.
     */
    describe("Load new tools page", function () {
        let tools;
        let beforeValue;
        let afterValue;
        let vuexBeforeValue;
        let vuexAfterValue;
        let spyToolsEvent;
        let selectorObject;
        let selectorItem;
        // const mainContainer = '#main_container'
        // const mainHtml = '<div id="main_container"><div class="loading-page"></div></div>'

        beforeAll(function (done) {
            $("#dropdown1").remove();

            Route.push({ name: "tools" });

            // Wait for Web Page to be loaded
            new Promise(function (resolve, reject) {
                Helpers.isResolved(resolve, reject, vm, "data", 0, 1);
            }).catch(function (rejected) {
                fail("The Tools Page did not load within limited time: " + rejected);
            }).then(function () {
                tools = $("#tools");
                beforeValue = tools.find("tbody").find("tr:nth-child(1)").find("td:nth-child(2)").text();
                vuexBeforeValue = $("h4").first()[0].innerText;

                selectorObject = $("#dropdown0");
                selectorObject = document.activeElement;
                selectorObject.click();
                selectorItem = $("#dropdown1 a")[1];
                spyToolsEvent = spyOnEvent(selectorItem, "select");
                selectorItem.click();
                Helpers.fireEvent(selectorItem, "select");
                // Note: if page does not refresh, increase the timer time.
                // Using RxJs instead of Promise.
                const numbers = timer(50, 50);
                const observable = numbers.subscribe(timer => {
                    afterValue = tools.find("tbody").find("tr:nth-child(1)").find("td:nth-child(2)").text();
                    vuexAfterValue = $("h4").first()[0].innerText;
                    if (afterValue !== beforeValue || timer === 20) {
                        observable.unsubscribe();
                        done();
                    }
                });
            });
        });

        it("setup and click events executed.", function () {
            // jasmine-jquery matchers
            expect("select").toHaveBeenTriggeredOn(selectorItem);
            expect(spyToolsEvent).toHaveBeenTriggered();

            expect(tools[0]).toBeInDOM();
            expect(".disabled").toBeDisabled();
            expect("#dropdown1 a").toHaveLength(3);
            // Required for Firefox
            selectorObject[0] = document.activeElement;
            expect(selectorObject).toBeFocused();
        });

        it("new page loaded on change.", function () {
            expect(beforeValue).not.toBe(afterValue);
        });

        it("vuex storage changed title.", function () {
            expect(vuexBeforeValue).not.toBe(vuexAfterValue);
        });
    });
}
