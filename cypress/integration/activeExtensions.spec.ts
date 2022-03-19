/// <reference types="cypress" />

describe("Active polkadot extensions", () => {
  before(() => {
    cy.activePolkadot();
  });

  beforeEach(() => {
    cy.wait(5 * 1000).then(() => { 
      cy.log('injected', window['injectedWeb3']);
      console.log("🚀 ~ file: activeExtensions.spec.ts ~ line 11 ~ cy.wait ~ cy", window['injectedWeb3']);
    });
    cy.visit(Cypress.config().baseUrl);
  });

  it('authorize extension', () => { 
    cy.authorizePolkadot(60 * 1000);
  });

});
