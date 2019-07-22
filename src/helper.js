import { TimeoutError } from 'puppeteer/Errors';

import elements from './elements';

const {
  url,
  userForm,
  passForm,
  loginButton,
} = elements;

const credential = {
  username: 'TEST',
  password: 'TEST'
}
const getPage = async (browser) => await browser.newPage();

const focusSelector = async (page, element) => {
  try {
    await page.waitForSelector(element);
    await page.focus(element);
  } catch (e) {
    if (e instanceof TimeoutError) {
      await page.waitForSelector(element);
      await page.evaluate('arguments[0].click()', element);
    } 
  }
  return page;
}

const writeForm = async (page, element, input) => {
  try {
    await page.type(element, input);
  } catch (e) {
    if (e instanceof TimeoutError) {
      await page.waitForSelector(element);
      await page.evaluate('arguments[0].click()', element);
      await page.type(element, input);
    }
  }
  return page;
}

const clickButton = async (page, element) => {
  try {
    await page.click(element);
  } catch (e) {
    if (e instanceof TimeoutError) {
      await page.waitForSelector(element);
      await page.evaluate('arguments[0].click()', element);
      await page.click(element);
    }
  }
  return page;
}

const login = async (page) => {
  await page.goto(url);

  await focusSelector(page, userForm);
  await writeForm(page, userForm, credential.username);
  await focusSelector(page, passForm);
  await writeForm(page, passForm, credential.password);
  
  await clickButton(page, loginButton);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
};

const fetchAllPosts = () => {
    // TODO
};

const saveAsJson = () => {
    // TODO
};

export {
  login,
  getPage,
  fetchAllPosts,
  saveAsJson,
};