import axios from 'axios';
import type { Browser, Page } from 'puppeteer';

const puppeteer = require('puppeteer');

export let browser: Browser;
export let mainPage: Page;
export let polkadotPage: Page;
let switchToPolkadotNotificationRetries = 0;

export const init = async () => {
  const res = await axios.get('http://localhost:9222/json/version');
  const debuggerDetailsConfig = res.data;
  console.log("🚀 ~ file: puppeteer.ts ~ line 14 ~ init ~ debuggerDetailsConfig", debuggerDetailsConfig)
  const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl;

  browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
  });

  const isConnected = browser.isConnected();
  console.log("🚀 ~ file: puppeteer.ts ~ line 24 ~ init ~ isConnected", isConnected)

  return isConnected;
};

const getExtensionId = async (browser: Browser) => {
  const targets = await browser.targets();
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

  const page = await browser.newPage();

  const extensionId = await getExtensionId(browser);

  await page.goto(`chrome-extension://${extensionId}/index.html#/`);

  polkadotPage = page;

  return true;
};

export const switchToCypressWindow = async () => {
  await mainPage.bringToFront();
  return true;
};

export const switchToPolkadotNotification = async () => {
  await polkadotPage.waitForTimeout(2000);

  const pages = await browser.pages();
  console.log("🚀 ~ file: puppeteer.ts ~ line 67 ~ switchToPolkadotNotification ~ pages", pages.map(item => item.url()))

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
