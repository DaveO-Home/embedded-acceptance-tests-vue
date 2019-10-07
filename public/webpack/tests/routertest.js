define(() => (Router, controller, action, id) => {
    const addId = id ? `/${id}` : "";
    let route;

    for (let routes of Router) {
        if (routes.name === action) {
            route = routes;
            break;
        }
    }
    if (testit) {
        describe(`Test Router: ${route.name}${addId}`, () => {
            it(`name set: ${action}`, () => {
                expect(route.name).toBe(action);
            });

            it(`path set: ${route.path}`, () => {
                expect(route.path !== null).toBe(true);
            });

            // if (id) {
            //     it(`id set: ${id}`, () => {
            //         expect(route.id).toBe(id)
            //     })
            // }

            it(`component defined: ${route.component.name}`, () => {
                expect(route.component.name).not.toBeUndefined();
            });
        });
    }
});
