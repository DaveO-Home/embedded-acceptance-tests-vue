
define(() => (Route, Helpers, App, Start, modules) => {
    const routerTest = modules[0]
    const domTest = modules[1]
    const toolsTest = modules[2]
    const contactTest = modules[3]
    const loginTest = modules[4]
    const vueElement = window._vue.$el

    describe('Application Unit test suite - AppTest', () => {
        beforeAll(() => {
            // Add virtual dom to karma page
            $('body').append(vueElement)
            /*
            * Jasmine spyOn fails with Vue
            */
            // spyOn(App, 'loadView').and.callThrough()
            // spyOn(Helpers, 'isLoaded').and.callThrough()
        }, 10000)

        afterEach(() => {
            $(vueElement.querySelector('#data')).empty()
        })

        afterAll(() => {
            $(vueElement).remove()
        }, 5000)

        it('Is Welcome Page Loaded', done => {
            /*
             * Loading Welcome page.
             */
            Route.push({name: 'start'})

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, 'data', 0, 1)
            }).catch(rejected => {
                fail(`The Welcome Page did not load within limited time: ${rejected}`)
            }).then(resolved => {
                // expect(App.loadView).toHaveBeenCalled()
                // expect(Helpers.isLoaded.calls.count()).toEqual(1)
                expect(App.controllers['Start']).not.toBeUndefined()
                expect(vueElement.querySelector('#data').children.length > 1).toBe(true)

                domTest('index', vueElement)
                done()
            })
        })

        it('Is Tools Table Loaded', done => {
            /*
             * Letting the Router load the appropriate page.
             */
            Route.push({name: 'tools'})

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, 'data', 0, 1)
            }).catch(rejected => {
                fail(`The Tools Page did not load within limited time: ${rejected}`)
            }).then(resolved => {
               // $('body').append(vueElement)
                expect(App.controllers['Table']).not.toBeUndefined()
                expect(vueElement.querySelector('#data').children.length > 1).toBe(true)

                domTest('tools', vueElement)
                done()
            })
        })

        routerTest(window._vue.$router.options.routes, 'table', 'tools', null)

        it('Is Pdf Loaded', done => {
            Route.push({name: 'test'})

            new Promise((resolve, reject) => {
                Helpers.isResolved(resolve, reject, 'main_container', 0, 1)
            }).catch(rejected => {
                fail(`The Pdf Page did not load within limited time: ${rejected}`)
            }).then(resolved => {
                expect(vueElement.querySelector('#main_container').children.length > 1).toBe(true)

                domTest('pdf', vueElement)
                done()
            })
        })

        routerTest(window._vue.$router.options.routes, 'pdf', 'test', null)

        // Executing here makes sure the tests are run in sequence.
        // Spec to test if page data changes on select change event.
        toolsTest(Route, Helpers)
        // Form Validation
        contactTest(Route, Helpers)
        // Verify modal form
        loginTest(Start)

        if (testOnly) {
            it('Testing only', () => {
                fail('Testing only, build will not proceed')
            })
        }
    })
})
