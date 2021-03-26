/*eslint no-unused-vars: "warn"*/
// import Route from "router";
import { timer } from "rxjs";
import { mount,
    // shallowMount,
    // RouterLinkStub,
    // VueWrapper,
    // DOMWrapper,
    // config,
    // flushPromises 
  } from "@vue/test-utils";
import StartC from "startc";
import PdfC from "pdfc";

describe("Application Unit test suite - AppTest", () => {
  it("Is Welcome Page Loaded from server", () => {
    cy.visit("/"); // .debug();
    cy.contains("h1", "Welcome To");
    cy.get("#vue-embedded-acceptance-testing-with-karma-and-jasmine").should("exist"); // markdown loaded
    cy.get("[data-testid=main_container]").find("div").its("length").should("be.gte", 3);
  });

  it("Is Welcome Page Loaded from component", (done) => {
    let wrapper = mount(StartC); // this has an async child component

    window.__mountMethod = true;

    const numbers = timer(50, 50);
    const observable = numbers.subscribe(timer => {
      if (wrapper.find("h1").exists() || timer === 50) { // If timer === 50, tests will fail
        observable.unsubscribe();
        window.__mountMethod = false;
        expect(wrapper.find("div").exists()).to.be.true;
        expect(wrapper.find("h1").text()).to.equal("Welcome To");
        done();
      }
    });
  });

  it("Is Tools Table Loaded from server", () => {
    cy.visit("/#table/tools");
    cy.get("[data-testid=main_container]").find("div").its("length").should("be.gte", 3);
    cy.get("[data-testid=tools-data]").find("h4").contains("Tools - Count Combined"); // .should("have.text", "Tools - Count");
    cy.get("[data-testid=tools-data]").find(".dropdown-menu").find(".dropdown-item").its("length").should("be.gt", 2);
    cy.get(".tablesorter").find("tbody").find("[role=row]").should("exist");
  });

  it("Is Pdf Loaded from server", () => {
    cy.visit("/#pdf/test");
    cy.get("[data-testid=main_container]").find("div").its("length").should("be.gte", 1);
    cy.get("#data[src$='Test.pdf']").its("length").should("be.gt", 0);
  });

  it("Is Tools Table Loaded from component", async () => {
    const wrapper = await mount(PdfC);

    expect(wrapper.find("#data[src$='Test.pdf']").exists()).to.be.true;
  });
});