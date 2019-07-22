import puppeteer from 'puppeteer';

const browser = async (config) => {
  const data = config;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-notifications', '--start-maximized'],
  });
  const page = await browser.newPage();

  return {
    page: page,
    data: data,
    close: async () => await browser.close(),
  }
};

export default browser;