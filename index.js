const puppeteer = require('puppeteer');

const start = async () => {
  const pathToExtension = require('path').join(__dirname, 'cypress/plugins/extensions/polkadot');
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    (target) => target.type() === 'background_page'
  );
  const backgroundPage = await backgroundPageTarget.page();

  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
//   await browser.close();
};

start();

