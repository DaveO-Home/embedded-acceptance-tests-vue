/*eslint no-unused-vars: "warn"*/
import { timer } from "rxjs";

describe("Load new tools page", () => {
  let tools;
  let beforeValue;
  let afterValue;
  let vuexBeforeValue;
  let vuexAfterValue;
  let selectorObject;
  let selectorItem;

  window.before(done => {
    cy.visit("#/table/tools");

    cy.get("#tools").then(toolsPage => {
      tools = toolsPage;
      beforeValue = tools.find("tbody").find("tr:nth-child(1)").find("td:nth-child(2)").text();
      vuexBeforeValue = window.Cypress.$("[data-testid=tools-data] h4").first()[0].innerText;

      selectorObject = window.Cypress.$("#dropdown0");
      selectorObject.trigger("click");
      selectorItem = window.Cypress.$("#dropdown1 a")[1];
      selectorItem.click();

      const numbers = timer(50, 50);
      const observable = numbers.subscribe(timer => {
        afterValue = tools.find("tbody").find("tr:nth-child(1)").find("td:nth-child(2)").text();
        vuexAfterValue = window.Cypress.$("[data-testid=tools-data] h4").first()[0].innerText;

        if (afterValue !== beforeValue || timer === 20) {
          observable.unsubscribe();
          expect(timer !== 20).to.be.true;
          done();
        }
      });
    });
  });

  it("setup and click events executed.", function () {
    expect(tools[0]).to.exist;
    expect(window.Cypress.$(".disabled")).to.be.disabled;
    cy.get("#dropdown1 a").its("length").should("eq", 3);
    expect(selectorObject).to.be.focused;
  });

  it("new page loaded on change.", function () {
    expect(beforeValue).not.to.equal(afterValue);
  });

  it("vuex storage changed title.", function () {
    expect(vuexBeforeValue).not.to.equal(vuexAfterValue);
  });
});