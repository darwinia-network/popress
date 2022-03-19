/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import { initialSetup, authorize } from './polkadot';

const Timeout = require('await-timeout');
const helpers = require('./helpers');

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('before:browser:launch', async (browser, launchOptions) => {
    const pathToExtension = await helpers.prepareExtension(process.env.POLKADOT_VERSION || '0.42.7');

    launchOptions.args.push(
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--auto-open-devtools-for-tabs'
    );

    launchOptions.extensions.push(pathToExtension);

    await Timeout.set(2000);

    return launchOptions;
  });

  on('task', {
    activePolkadot: async (secretWords: string) => {
      await initialSetup(secretWords);

      return true;
    },

    authorizePolkadot: async (timeout?: number) => {
      await authorize(timeout);
      return true;
    },
  });

  return config;
};
