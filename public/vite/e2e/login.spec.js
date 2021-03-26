/*eslint no-unused-vars: "warn"*/
import { timer } from "rxjs";

describe("Load new tools page", () => {
  let modal;
  let nameObject;

  window.before(done => {
    cy.visit("/");

    cy.get("div .login").then(loginObject => {
      loginObject[0].click();

        cy.get("#modalTemplate").then((modalObject) => {
          modal = modalObject;
          nameObject = modalObject.find("#inputUsername");
          modal.on("shown.bs.modal", function () {
            modal.modal("toggle");
          });
          done();
      });
    });
  });

  it("Login form - verify modal with login loaded", () => {
    expect(modal[0]).to.exist;
    expect(nameObject[0]).to.exist;
  });

  it("Login form - verify cancel and removed from DOM", done => {
    expect(modal[0]).to.exist;
    
    cy.get(".close-modal:visible").then(() => {
      modal.modal("hide");

      const numbers = timer(50, 50);
      const observable = numbers.subscribe(timer => {
      const modal2 = window.Cypress.$("#modalTemplate");
        if (typeof modal2[0] === "undefined" || timer === 25) {
          expect(timer).not.to.equal(25);
          expect(modal[0]).not.to.be.visible;
          expect(modal[0]).not.to.exist;
          observable.unsubscribe();
          done();
        }
      });
    });
  });
});