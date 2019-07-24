import fs from 'fs';
import util from 'util';
import { TimeoutError } from 'puppeteer/Errors';

import elements from './helpers/elements';

const {
  url,
  userForm,
  passForm,
  loginButton,
  postSelector,
  postFeedSelector,
  argumentSelector,
  groupPostDiv,
  groupSelectors,
} = elements;

const focusSelector = async (page, element) => {
  try {
    await page.waitForSelsector(element);
    await page.focus(element);
  } catch (e) {
    if (e instanceof TimeoutError) {
      await page.waitForSelector(element);
      await page.evaluate(argumentSelector, element);
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
      await page.evaluate(argumentSelector, element);
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
      await page.evaluate(argumentSelector, element);
      await page.click(element);
    }
  }
  return page;
}

const login = async (browser) => {
  console.log('Logging you in under your credentials...')
  const page = browser.page;
  await page.goto(url, { waitUntil: 'load' });

  await focusSelector(page, userForm);
  await writeForm(page, userForm, browser.data.username);
  await focusSelector(page, passForm);
  await writeForm(page, passForm, browser.data.password);
  
  await clickButton(page, loginButton);
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.screenshot({
    path: 'login.png',
    fullPage: true
  });
  return browser;
};

const scrollToBottom = async (page) => {
  console.log('Scrolling the facebook group...\n this might take a while!')
  const distance = 100; // should be less than or equal to window.innerHeight
  const delay = 100;
  while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
    await page.evaluate((y) => {
      document.scrollingElement.scrollBy(0, y);
    }, distance);
    await page.waitFor(delay);
  }
};

const clickAllButtons = async (page, element) => {
  return page.evaluate((selector) => {
    const elements = document.querySelectorAll(selector);
    return Promise.all(Array.prototype.map.call(elements, e => e.click()));
  }, element)
}

const getPostData = async (page, groupIds) => {
  const posts = groupIds.map(async id => {
    if (typeof id === 'string') {
      const selector = groupPostDiv(id);
      return page.evaluate((selector, groupSelectors) => {
        const getText = (div) => {

          const bigText = div.querySelector(groupSelectors.groupPostBigText)
            ? div.querySelector(groupSelectors.groupPostBigText).textContent
            : ''
          const text = div.querySelector(groupSelectors.groupPostText)
            ? div.querySelector(groupSelectors.groupPostText).textContent
            : ''

          const img = div.querySelector(groupSelectors.groupPostImg)
            && div.querySelector(groupSelectors.groupPostImg).getAttribute('src')
          const linkImg = div.querySelector(groupSelectors.groupPostLinkImg)
          && div.querySelector(groupSelectors.groupPostLinkImg).getAttribute('src')

          const link = div.querySelector(groupSelectors.groupPostLink)
          && div.querySelector(groupSelectors.groupPostLink).getAttribute('href')

          return {
            op: div.querySelector(groupSelectors.groupPostsAuthor).textContent,
            date: div.querySelector(groupSelectors.postDate).textContent,
            text: bigText || text,
            img: linkImg || img,
            link,
          };
        };
        const getComments = (div) => {
          const commentSpans = div.querySelectorAll(groupSelectors.groupCommentText);
          return Array.prototype.map.call(commentSpans, el => el.textContent);
        };
        const divs = document.querySelectorAll(selector)
        const contentDiv = Array.prototype.filter.call(divs, el => el.innerText !== '')
        const postContentDiv = getText(contentDiv[0].firstElementChild);
        const commentContentDiv = getComments(contentDiv[0].lastElementChild);
        return {
          post: postContentDiv,
          comments: commentContentDiv
        }
      }, selector, groupSelectors)
    }
  });
  return Promise.all(posts)
};

const fetchAllPosts = async (browser) => {
  const page = browser.page;
  const groupUrl = `${url}/groups/${browser.data.groupId}`;
  await page.goto(groupUrl, { waitUntil: 'load' });

  await scrollToBottom(page);
  await clickAllButtons(page, groupSelectors.groupMoreCommentsButton);
  await page.waitFor(3000);
  await page.screenshot({
    path: 'groupfeed.png',
    fullPage: true
  });

  const postValues = await page.$$eval(postSelector, e => e);
  const postFeedValues = await page.$$eval(postFeedSelector, e => e);
  const getIdOfSelector = item => JSON.parse(item.__FB_STORE['data-ft'])['mf_story_key'];
  const postArticleIds = postValues.map(getIdOfSelector)
  const postFeedIds = postFeedValues.map(getIdOfSelector)

  const groupPostIds = [
    ...postArticleIds,
    ...postFeedIds,
  ]
  console.log('Getting the posts data...')
  return getPostData(page, groupPostIds);
};

const saveAsJson = async (posts) => {
  console.log('Saving data as json!')
  const write = util.promisify(fs.writeFile);
  await write('data.json', JSON.stringify(posts), 'utf8');
  console.log('Saved as data.json!');
  return posts
};

export {
  login,
  fetchAllPosts,
  saveAsJson,
};