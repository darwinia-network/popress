/// <reference types="cypress" />

describe("Active polkadot extensions", () => {
  before(() => {
    cy.activePolkadot();
  });

  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('authorize extension', () => { 
    cy.authorizePolkadot(60 * 1000);
    cy.wait(60 * 1000).then(() => { });
  });

});
