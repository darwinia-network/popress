import {
  init,
  assignWindows,
  polkadotPage,
  switchToCypressWindow,
  switchToPolkadotNotification,
  browser,
} from './puppeteer';

export const initialSetup = async (secretWords: string) => {
  await init();
  await assignWindows();

  await polkadotPage.waitForTimeout(2000);

  browser.browserContexts();

  await polkadotPage.waitForSelector('.logoText');

  const element = await polkadotPage.$('.logoText');
  const text = await polkadotPage.evaluate((ele) => ele.textContent, element);

  if (text === 'Welcome') {
    const welcomeBtn = await polkadotPage.$('button');

    await welcomeBtn.click();
    await addAccount(secretWords);
  } else if (text === 'Add Account') {
    await addAccount(secretWords);
  }

  await switchToCypressWindow();

  return true;
};

export const addAccount = async (secretWords: string) => {
  await polkadotPage.waitForSelector('.popupToggle');

  const addBtn = await polkadotPage.$('.popupToggle');

  await addBtn.click();

  await polkadotPage.waitForSelector('.menuItem');

  const menuItems = await polkadotPage.$$('.menuItem');
  const importBtn = menuItems[2];

  await importBtn.click();

  await polkadotPage.waitForSelector('.seedInput');

  const seedInput = await polkadotPage.$('.seedInput');

  await seedInput.type(secretWords);

  const nextBtn = await polkadotPage.$('button');

  await nextBtn.click();

  await polkadotPage.waitForSelector('input[type=text]');

  const nameInput = await polkadotPage.$('input[type=text]');

  await nameInput.type('hulk');

  await polkadotPage.waitForSelector('input[type=password]');

  const pwdInput = await polkadotPage.$('input[type=password]');
  const pwd = 'qwertyuiop';

  await pwdInput.type(pwd);

  const pwdList = await polkadotPage.$$('input[type=password]');
  const confirmPwdInput = pwdList[1];

  await confirmPwdInput.type(pwd);

  const btnList = await polkadotPage.$$('button');
  const suppliedBtn = btnList[1];

  await suppliedBtn.click();

  return true;
};

export const authorize = async (timeout = 3000) => {
  const notificationPage = await switchToPolkadotNotification();
  // await puppeteer.waitAndClick(permissionsPageElements.connectButton, notificationPage);
  // await puppeteer.metamaskWindow().waitForTimeout(3000);
  // const promise = new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, timeout);
  // });

  // await promise;

  return true;
};
