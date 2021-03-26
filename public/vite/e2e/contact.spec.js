/*eslint no-unused-vars: "warn"*/
import { timer } from "rxjs";

describe("Contact Form Validation", () => {
  let contact;
  let submitObject;
  let nameObject;
  let emailObject;
  let commentObject;

  window.before(() => {
    cy.visit("#/contact");
  });

  it("Contact form - verify required fields", () => {
    cy.get("[data-testid=main_container] form").then((container) => {
      contact = container;
      nameObject = container.find("#inputName");
      emailObject = container.find("#inputEmail");
      commentObject = container.find("#inputComment");

      expect(contact).to.exist;
      expect(nameObject[0].validity.valueMissing).to.be.true;
      expect(emailObject[0].validity.valueMissing).to.be.true;
      expect(commentObject[0].validity.valueMissing).to.be.true;
      expect(container.find("input[type=checkbox]")[0].validity.valueMissing).to.be.false;
    });
  });

  it("Contact form - validate populated fields, email mismatch.", () => {
    submitObject = contact.find("input[type=submit]");

    nameObject.val("me");
    emailObject.val("notanemailaddress");
    commentObject.val("Stuff");

    submitObject.click();

    expect(nameObject[0].validity.valueMissing).to.be.false;
    expect(nameObject[0].checkValidity()).to.be.true;
    expect(commentObject[0].validity.valueMissing).to.be.false;
    expect(commentObject[0].checkValidity()).to.be.true;
    expect(emailObject[0].validity.valueMissing).to.be.false;
    expect(emailObject[0].checkValidity()).to.be.false;
    expect(emailObject[0].validity.typeMismatch).to.be.true;
  });

  it("Contact form - validate email with valid email address.", () => {
    emailObject.val("ace@ventura.com");

    expect(emailObject[0].validity.typeMismatch).to.be.false;
    expect(emailObject[0].checkValidity()).to.be.true;
  });

  it("Contact form - validate form submission.", done => {
    submitObject.click();

    const numbers = timer(1000, 50);
    const observable = numbers.subscribe(timer => {
      if (typeof contact[0] === "undefined" || timer === 50) {
        observable.unsubscribe();
        expect(contact).not.to.be.visible;
        expect(contact).not.to.exist;
        done();
      }
    });
  });
});