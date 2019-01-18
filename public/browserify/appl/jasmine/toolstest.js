export default function (Route, Helpers, vm) {
    /*
     * Test that new data are loaded when the select value changes.
     */
    describe('Load new tools page', function () {
        let tools
        let beforeValue
        let afterValue
        let spyToolsEvent
        let selectorObject
        let selectorItem
        // const mainContainer = '#main_container'
        // const mainHtml = '<div id="main_container"><div class="loading-page"></div></div>'

        beforeAll(function (done) {
            $('#dropdown1').remove()

            Route.push({name: 'tools'})

            // Wait for Web Page to be loaded
            new Promise(function (resolve, reject) {
                Helpers.isResolved(resolve, reject, vm, 'data', 0, 1)
            }).catch(function (rejected) {
                fail('The Tools Page did not load within limited time: ' + rejected)
            }).then(function (resolved) {
                tools = $('#tools')
                beforeValue = tools.find('tbody').find('tr:nth-child(1)').find('td:nth-child(2)').text()

                selectorObject = $('#dropdown0')
                selectorObject = document.activeElement
                selectorObject.click()
                selectorItem = $('#dropdown1 a')[1]
                spyToolsEvent = spyOnEvent(selectorItem, 'select')
                selectorItem.click()
                Helpers.fireEvent(selectorItem, 'select')
                // Note: if page does not refresh, increase the Timeout time.
                // Using setTimeout instead of Promise.
                setTimeout(function () {
                    afterValue = tools.find('tbody').find('tr:nth-child(1)').find('td:nth-child(2)').text()
                    done()
                }, 1000)
            })
        })

        it('setup and click events executed.', function () {
            // jasmine-jquery matchers
            expect('select').toHaveBeenTriggeredOn(selectorItem)
            expect(spyToolsEvent).toHaveBeenTriggered()

            expect(tools[0]).toBeInDOM()
            expect('.disabled').toBeDisabled()
            expect('#dropdown1 a').toHaveLength(3)
            // Required for Firefox
            selectorObject[0] = document.activeElement
            expect(selectorObject).toBeFocused()
        })

        it('new page loaded on change.', function () {
            expect(beforeValue).not.toBe(afterValue)
        })
    })
}
