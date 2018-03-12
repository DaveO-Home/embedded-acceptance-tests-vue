export default function (Router, controller, action, id) {
    const addId = id ? `/${id}` : ''
    let route

    for (let i = 0; i < Router.length; i++) {
        if (Router[i].name === action) {
            route = Router[i]
            i = Router.length + 1
        }
    }
    if (testit) {
        describe(`Test Router: ${route.name}${addId}`, () => {
            it(`name set: ${action}`, () => {
                expect(route.name).toBe(action)
            })

            it(`path set: ${route.path}`, () => {
                expect(route.path !== null).toBe(true)
            })

            // if (id) {
            //     it(`id set: ${id}`, () => {
            //         expect(route.id).toBe(id)
            //     })
            // }

            it(`component defined: ${route.component.name}`, () => {
                expect(route.component.name).not.toBeUndefined()
            })
        })
    }
}
