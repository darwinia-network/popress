import '@testing-library/cypress/add-commands';

Cypress.Commands.add('activePolkadot', () => {
  cy.task('activePolkadot', 'path royal defy come layer crane provide when term forest such ivory');
});

Cypress.Commands.add('authorizePolkadot', (timeout?: number) => {
  cy.task('authorizePolkadot', timeout);
});
