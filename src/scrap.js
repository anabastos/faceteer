import puppeteer from 'puppeteer';
import { pipeP } from 'ramda';

import { getPage, login } from './helper';

const scrap = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-notifications', '--start-maximized'],
  });
  const doLogin = async () => {
    try {
      const test = pipeP(
        getPage,
        login,
      )
      await test(browser);
    } catch (e) {
      throw `Could not login \n ${e}`
    }
  }
  return {
    login: async () => doLogin(),
    close: async () => await browser.close(),
  }
};

export default scrap;