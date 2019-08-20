import puppeteer from 'puppeteer';

const browser = async (config) => {
  const data = {
    members: false,
    posts: false,
    ...config
  };

  const defaultViewport = {
    deviceScaleFactor: 1,
    hasTouch: false,
    height: 1024,
    isLandscape: false,
    isMobile: false,
    width: 1280
  };

  const browser = await puppeteer.launch({
    headless: true,
    devtools: false,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: [
      '--disable-notifications',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
  });

  const page = await browser.newPage();
  
  await page.setViewport(defaultViewport);
  
  data.debug && page.on('console', (log) => console[log._type](log._text));
  page.getBrowser = () => browser;
  page.retryCount = 3;


  return {
    page: page,
    data: data,
    close: async () => await browser.close(),
  }
};

export default browser;