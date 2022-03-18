declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Active the prepared polkadot extensions
     */
    activePolkadot(): Chainable<Subject>;

    /**
     * Run the flow for polkadot setup
     */
    setupPolkadot(secretWords: string): Chainable<Subject>;

    /**
     * authorize polkadot extensions
     */
     authorizePolkadot(timeout?: number): Chainable<Subject>;
  }
}
