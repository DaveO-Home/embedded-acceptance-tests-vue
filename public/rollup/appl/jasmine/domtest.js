export default function (resource) {
    if (testit) {
        switch (resource) {
            case "index":
                expect(document.querySelector("#content h1").textContent).toBe("Welcome To");
                break;
            case "pdf":
                expect($("main").find("#data[src$=\"Test.pdf\"]").length > 0).toBe(true);
                break;
            case "tools":
                expect($("main").find(".dropdown-menu").find(".dropdown-item").length > 2).toBe(true);
                break;
            default:
        }
    }
}
