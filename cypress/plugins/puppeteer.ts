import axios from 'axios';
import { enable } from '@polkadot/extension-base/page';
import { injectExtension } from '@polkadot/extension-inject';
import type { Browser, Page } from 'puppeteer';

const puppeteer = require('puppeteer');

export let browser: Browser;
export let mainPage: Page;
export let polkadotPage: Page;
let switchToPolkadotNotificationRetries = 0;

export const init = async () => {
  const res = await axios.get('http://localhost:9222/json/version');
  const debuggerDetailsConfig = res.data;
  const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;

  browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
  });

  return browser.isConnected();
};

const getExtensionId = (browser: Browser) => {
  const targets = browser.targets();
  let url: string;

  for (let target of targets) {
    if (target.type() === 'background_page') {
      url = target.url();
      break;
    }
  }

  return url.split('/')[2];
};

export const assignWindows = async () => {
  const pages = await browser.pages();

  mainPage = pages[0];

  const ctx = mainPage.browserContext();
  const page = await ctx.newPage();

  const extensionId = getExtensionId(browser);
  const extUrl = `chrome-extension://${extensionId}/index.html#/`;

  await page.goto(extUrl);

  polkadotPage = page;

  return true;
};

export const switchToCypressWindow = async () => {
  await mainPage.bringToFront();
  return true;
};

export const switchToPolkadotNotification = async () => {
  const pages = await browser.pages();

  const frames = mainPage.frames();
  const frame = frames.find((item) => item.url() === 'http://localhost:3000/');
  const ele = await frame.$('#root');

  await ele.evaluate(() => {
    console.log('🚀 ~ file: polkadot.ts ~ line 35 ~ frame.evaluate ~ window.location.href', window.location.href);

    window['injectedWeb3'] = {
      'polkadot-js': {
        version: '0.42.7',
        enable: function(origin) {
          enable(origin);
        }
      },
    };

    // injectExtension(enable, { name: 'polkadot-js/apps', version: '0.42.7' });

    return true;
  });

  for (const page of pages) {
    if (page.url().includes('notification')) {
      switchToPolkadotNotificationRetries = 0;

      await page.bringToFront();
      return page;
    }
  }

  if (switchToPolkadotNotificationRetries < 24) {
    switchToPolkadotNotificationRetries++;
    return await switchToPolkadotNotification();
  } else {
    switchToPolkadotNotificationRetries = 0;
    return false;
  }
};
