define(() => (Start) => {
    /*
     * Test Form validation and submission.
     */
    describe('Popup Login Form', () => {
        let modal
        let closeButton

        beforeAll(done => {
            Start.initMenu()
            Start.base = true
            // Somehow we lost the listener-?
            Start['div .login click']()
            const loginObject = $('div .login')
            loginObject.click()

            // Not bothering with a promise.
            setTimeout(() => {
                done()
            }, 100)
        })

        it('Login form - verify modal with login loaded', done => {
            modal = $('#modalTemplate')
            let nameObject = $('#inputUsername')

            expect(modal[0]).toBeInDOM()
            expect(nameObject[0]).toExist()

            closeButton = $('button.close-modal')

            closeButton.click(() => {
                setTimeout(() => {
                    expect(modal[0]).not.toBeInDOM()
                    expect(modal[0]).not.toExist()
                }, 100)
            })

            done()
        })

        it('Login form - verify cancel and removed from DOM', () => {
            expect(modal[0]).toExist()
            closeButton.click()

            setTimeout(() => { closeButton.click() }, 500)
        })
    })
})
