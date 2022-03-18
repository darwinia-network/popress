import axios from 'axios';
import type { Browser, Page } from 'puppeteer';

const puppeteer = require('puppeteer-core');

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

export const assignWindows = async () => {
  const pages = await browser.pages();

  mainPage = pages[0];

  const page = await browser.newPage();

  // TODO: url below is hardcoded
  await page.goto('chrome-extension://ldenbinemdlbjlbinmegfgakfgghadnk/index.html#/');

  polkadotPage = page;

  return true;
};

export const switchToCypressWindow = async () => {
  await mainPage.bringToFront();
  return true;
};

export const switchToPolkadotNotification = async () => {
  await polkadotPage.waitForTimeout(2000);

  const targets = await browser.targets();

  const pages = await browser.pages();
  console.log("🚀 ~ file: puppeteer.ts ~ line 51 ~ switchToPolkadotNotification ~ pages", pages)

  for (const target of targets) {
    if (target.type() === 'background_page') {
      // const browser = target.browser();
      // const pages = await browser.pages();

      const backgroundPage = await target.page();

      // console.log('---background page--->', backgroundPage);

      // console.log('------->', pages, pages[0] === backgroundPage);

      switchToPolkadotNotificationRetries = 0;

      await backgroundPage.bringToFront();

      return backgroundPage;
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
