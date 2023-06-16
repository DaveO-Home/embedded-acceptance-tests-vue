/*eslint no-unused-vars: "warn"*/
import { timer } from "rxjs";
import ContactC from "../src/appl/components/ContactC.vue";
//import DodexC from "../src/appl/components/DodexC.vue";
import start from "../src/appl/js/controller/start"
window.testit = false;

describe("<ContactC />", () => {
  let contact;
  let submitObject;
  let nameObject;
  let emailObject;
  let commentObject;

  it("Mount Contact Component", () => {
    cy.mount(ContactC, {}).then((proxy) => {
      cy.get("form").then((container) => {
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
  });

  it("Contact form - validate populated fields, email mismatch.", () => {
    cy.mount(ContactC, {}).then((proxy) => {
      cy.get("form").then((container) => {
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

        expect(contact[0]).not.to.be.null;
      });
    });
  });

  it("Contact form - validate email with valid email address.", () => {
    cy.mount(ContactC, {}).then((proxy) => {
      cy.get("form").then((container) => {
        emailObject.val("ace@ventura.com");

        expect(emailObject[0].validity.typeMismatch).to.be.false;
        expect(emailObject[0].checkValidity()).to.be.true;
      });
    });
  });
});
