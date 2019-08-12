import puppeteer from 'puppeteer';

const browser = async (config) => {
  const data = config;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-notifications', '--start-maximized'],
  });
  const page = await browser.newPage();
  page.on('console', (log) => console[log._type](log._text));
  page.getBrowser = () => browser;

  return {
    page: page,
    data: data,
    close: async () => await browser.close(),
  }
};

export default browser;