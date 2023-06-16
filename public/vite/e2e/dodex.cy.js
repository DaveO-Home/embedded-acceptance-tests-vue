/*eslint no-unused-vars: "warn"*/

describe("Load new tools page", () => {
  /*
     * Test Dodex operation.
     */
  let dodexElement,
    dodexToggle,
    dodexTopElement,
    card1,
    card2,
    front1,
    front2,
    back1,
    back2,
    // dialRight,
    // dialLeft,
    mouseEvent = new MouseEvent("mousedown");

  window.before(done => {
    cy.visit("/");
    cy.get(".top--dodex").then(dodexObject => {
      dodexTopElement = dodexObject[0];
      cy.get(".dodex--open").then(toggleObject => {
        dodexToggle = toggleObject[0];
        dodexToggle.onmousedown();
        dodexElement = dodexObject.find(".dodex")[0];
        card1 = dodexObject.find(".card1")[0];
        front1 = dodexObject.find(".front1")[0];
        back1 = dodexObject.find(".back1")[0];
        card2 = dodexObject.find(".card2")[0];
        front2 = dodexObject.find(".front2")[0];
        back2 = dodexObject.find(".back2")[0];
        // const dials = getAllElements(".dial");
        // dialRight = dials[0];
        // dialLeft = dials[1];
        done();
      });
    });
  });

  it("Dodex - loaded and toggle on icon mousedown", () => {
    expect(dodexElement).not.to.be.undefined;
    expect(dodexTopElement).not.to.be.undefined;
    expect(dodexTopElement).to.have.class("plus-thousand");
    dodexToggle.onmousedown();
    expect(dodexTopElement).to.have.class("minus-thousand");  // z-index=-1000
    dodexToggle.onmousedown(); // Make visible again
    expect(dodexTopElement).to.have.class("plus-thousand");
  });

  it("Dodex - Check that card A is current and flipped on mousedown", () => {
    expect(card1.style.zIndex).to.equal("");
    expect(card2.style.zIndex).to.equal("");

    // Needed to generate proper event.target
    front1.onmousedown = dodexElement.onmousedown; // Generic dodex handler for all cards.
    front1.dispatchEvent(mouseEvent);

    expect(card1.style.zIndex === "0").to.be.true;
    expect(card1.style.transform).to.contain("rotateX(-190deg)");
    expect(card2.style.zIndex).to.equal("");
    expect(card2.style.transform).to.equal("");
  });

  it("Dodex - Check that card B is current and flipped on mousedown", () => {
    expect(card2.style.zIndex).to.equal("");
    expect(card2.style.transform).to.equal("");

    front2.onmousedown = dodexElement.onmousedown;
    front2.dispatchEvent(mouseEvent);

    expect(card1.style.zIndex === "0").to.be.true;
    expect(card2.style.zIndex).to.equal("1");
    expect(card1.style.transform).to.contain("rotateX(-190deg)");
    expect(card2.style.transform).to.match(/rotateX\(-190deg\)/);
  });

  it("Dodex - Flip cards A & B back to original positions", () => {
    back2.onmousedown = dodexElement.onmousedown;
    back2.dispatchEvent(mouseEvent);

    expect(card1.style.zIndex === "0").to.be.true;
    expect(card1.style.transform).to.contain("rotateX(-190deg)");
    expect(card2.style.zIndex).to.equal("");
    expect(card2.style.transform).to.equal("");

    back1.onmousedown = dodexElement.onmousedown;
    back1.dispatchEvent(mouseEvent);

    expect(card1.style.zIndex).to.match(/s?/);
    expect(card1.style.transform).to.match(/s?/);
  });

  it("Dodex - Flip multiple cards on tab mousedown", {
    defaultCommandTimeout: 6000
  }, () => {
    // Make sure all cards are in original position
    var x, card;
    for (x = 1;x < 14;x++) {
      card = dodexTopElement.querySelector(".card" + x);
      expect(card.style.zIndex).to.be.equal("");
    }

    var frontM = dodexTopElement.querySelector(".front13");
    frontM.onmousedown = dodexElement.onmousedown;
    frontM.dispatchEvent(mouseEvent);
    // When tab M is clicked, it and all previous cards should be flipped.
    for (x = 1;x < 14;x++) {
      card = dodexTopElement.querySelector(".card" + x);
      expect(card.style.transform).to.match(/rotateX\(-190deg\)/);
    }

    // Card N should be top card.
    card = dodexTopElement.querySelector(".card14");
    expect(card.style.transform).to.equal("");

    // front works here because the pseudo tab element does not have a back.
    front1.dispatchEvent(mouseEvent);
    // All cards should be back in original position;
    for (x = 13;x > 0;x--) {
      card = dodexTopElement.querySelector(".card" + x);
      expect(card.style.transform).to.be.equal("");
    }
  });

  it("Dodex - Add additional app/personal cards", () => {
    let card28 = dodexTopElement.querySelector(".card28");
    let card29 = dodexTopElement.querySelector(".card29");

    card28 = dodexTopElement.querySelector(".card28");
    card29 = dodexTopElement.querySelector(".card29");

    expect(card28).to.have.class("card");
    expect(card29).to.have.class("card");

    var tab = getComputedStyle(
      card28.querySelector(".front28"), ":after"
    ).getPropertyValue("--tab");

    expect(tab).to.equal("\"F01\"");
  });

  it("Dodex - Load Login Popup from card1(A)", {
      defaultCommandTimeout: 6000
    }, (done) => {
    var nameObject;

    cy.get(".login-a").then((login) => {
      login.click();
      cy.get("#modalTemplate").then((modal) => {
          nameObject = modal[0].querySelector("#inputUsername");
          modal.on("shown.bs.modal", (/* html */) => {
            modal.modal("toggle");
          });
          expect(modal[0]).to.have.class("modal");
          expect(nameObject).to.have.class("form-control");
          modal.modal("hide");
          done();
      });
    });
  });
});
