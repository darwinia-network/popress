/// <reference types="cypress" />

describe("Ring transfer", () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it("can launch tx", () => {
    cy.get("input[type=text]").type("5FA7CzAgT5fNDFRdb4UWSZX3b9HJsPuR7F5BF4YotSpKxAA2");
    cy.get("input[type=number]").type("3");

    cy.get("button").click();
  });
});
