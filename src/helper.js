import { TimeoutError } from 'puppeteer/Errors';
import elements from './elements';

const {
  url,
  userForm,
  passForm,
  loginButton,
  postSelector,
  postFeedSelector,
} = elements;

const config = {
  username: '',
  password: '',
  groupId: '',
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
  await page.goto(url, { waitUntil: 'load' });

  await focusSelector(page, userForm);
  await writeForm(page, userForm, config.username);
  await focusSelector(page, passForm);
  await writeForm(page, passForm, config.password);
  
  await clickButton(page, loginButton);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  return page;
};

const scrollToBottom = async (page) => {
  const distance = 100; // should be less than or equal to window.innerHeight
  const delay = 100;
  while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
    await page.evaluate((y) => {
      document.scrollingElement.scrollBy(0, y);
    }, distance);
    await page.waitFor(delay);
  }
};

const getPostData = async (page, groupIds) => {
  return groupIds
};

const fetchAllPosts = async (page) => {
  const groupUrl = `${url}/groups/${config.groupId}`;
  await page.goto(groupUrl, { waitUntil: 'load' });

  await scrollToBottom(page);
  await page.waitFor(3000);
  
  await page.screenshot({
    path: 'groupfeed.png',
    fullPage: true
  });

  const postValues = await page.$$eval(postSelector, e => e);
  const postFeedValues = await page.$$eval(postFeedSelector, e => e);
  const getIdOfSelector = item => JSON.parse(item.__FB_STORE['data-ft']).qid;
  const postArticleIds = postValues.map(getIdOfSelector)
  const postFeedIds = postFeedValues.map(getIdOfSelector)

  const groupPostIds = [
    ...postArticleIds,
    ...postFeedIds,
  ]
  return getPostData(page, groupPostIds);
};

const saveAsJson = async (posts) => {
  await console.log(posts);  
  return posts
};

export {
  login,
  getPage,
  fetchAllPosts,
  saveAsJson,
};