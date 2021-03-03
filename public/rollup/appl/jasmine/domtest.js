export default function (resource, vueElement) {
    if (testit) {
        switch (resource) {
            case "index":
                expect(vueElement.querySelector("#main_container h1").textContent).toBe("Welcome To");
                break;
            case "pdf":
                expect($(vueElement).find("#data[src$=\"Test.pdf\"]").length > 0).toBe(true);
                break;
            case "tools":
                expect($(vueElement).find(".dropdown-menu").find(".dropdown-item").length > 2).toBe(true);
                break;
            default:
        }
    }
}
