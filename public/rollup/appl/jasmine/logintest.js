export default function (Start, timer) {
    /*
     * Test Form validation and submission.
     */
    describe("Popup Login Form", () => {
        let modal;
        let closeButton;
        let nameObject;

        beforeAll(done => {
            Start.initMenu();
            Start.base = true;
            // Somehow we lost the listener-?
            Start["div .login click"]();
            const loginObject = $("div .login");
            loginObject.trigger("click");

            // Note: if page does not refresh, increase the timer time.
            // Using RxJs instead of Promise.
            const numbers = timer(50, 50);
            const observable = numbers.subscribe(timer => {
                modal = $("#modalTemplate");
                if ((typeof modal[0] !== "undefined" && modal[0].length !== 0) || timer === 20) {
                    observable.unsubscribe();
                    nameObject = $("#inputUsername");
                    modal.on("shown.bs.modal", function () {
                        modal.modal("toggle");
                    });
                    done();
                }
            });
        });

        it("Login form - verify modal with login loaded", function (done) {
            expect(modal[0]).toBeInDOM();
            expect(nameObject[0]).toExist();

            closeButton = $(".close-modal");
            done();
        });

        it("Login form - verify cancel and removed from DOM", function (done) {
            expect(modal[0]).toExist();
            closeButton.click();

            const numbers = timer(50, 50);
            const observable = numbers.subscribe(timer => {
                const modal2 = $("#modalTemplate");
                if (typeof modal2[0] === "undefined" || timer === 25) {
                    observable.unsubscribe();
                    expect(modal[0]).not.toBeVisible();
                    expect(modal[0]).not.toBeInDOM();
                    $("div .login").remove(); // Just cleaning up page for tdd
                    done();
                }
            });
        });
    });
}
