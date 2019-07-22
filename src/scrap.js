import puppeteer from 'puppeteer';

const scrap = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-notifications', '--start-maximized'],
  });
  const goToPage = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: 'example.png'});
  }
  return {
    goTo: async (url) => goToPage(url),
    close: async () => await browser.close(),
  }
};

export default scrap;