/// <reference types="cypress" />
import { initialSetup, authorize } from './polkadot';
import { join } from 'path';

const cracoPlugin = require('@cypress/react/plugins/craco');
const cracoConf = require(join(__dirname, '../../craco.config.js'));
const Timeout = require('await-timeout');
const helpers = require('./helpers');

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  cracoPlugin(on, config, cracoConf);

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
