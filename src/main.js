import fs from 'fs';
import util from 'util';
import { TimeoutError } from 'puppeteer/Errors';
import {
  applySpec,
} from 'ramda';

import elements from './helpers/elements';
import options from './helpers/options';
import getAge from './helpers/dateUtil';

const { ptBr } = options;
const {
  familyRelations,
  romanticRelations,
} = ptBr;

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
  profileSelectors,
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

          const bigText = div.querySelector(groupSelectors.postBigText)
            ? div.querySelector(groupSelectors.postBigText).textContent
            : ''
          const text = div.querySelector(groupSelectors.postText)
            ? div.querySelector(groupSelectors.postText).textContent
            : ''

          const img = div.querySelector(groupSelectors.postImg)
            && div.querySelector(groupSelectors.postImg).getAttribute('src')
          const linkImg = div.querySelector(groupSelectors.postLinkImg)
          && div.querySelector(groupSelectors.postLinkImg).getAttribute('src')

          const link = div.querySelector(groupSelectors.postLink)
          && div.querySelector(groupSelectors.postLink).getAttribute('href')

          const author = div.querySelector(groupSelectors.postsAuthor);
          const date = div.querySelector(groupSelectors.postDate)
          return {
            op: author && author.textContent,
            date: date && date.textContent,
            text: bigText || text,
            img: linkImg || img,
            link,
          };
        };
        const getComments = (div) => {
          const commentSpans = div.querySelectorAll(groupSelectors.commentText);
          return Array.prototype.map.call(commentSpans, el => el && el.textContent);
        };

        const divs = document.querySelectorAll(selector)
        const contentDiv = Array.prototype.filter.call(divs, el => el.innerText !== '')
        
        const postDiv = contentDiv[0].firstElementChild;
        const commentDiv = contentDiv[0].lastElementChild;

        return {
          post: getText(postDiv),
          comments: getComments(commentDiv),
        };
      }, selector, groupSelectors);
    }
  });
  return Promise.all(posts)
};

const getKeyValueObjBySelector = (page, key, value) => {
  return page.evaluate((key, value) => {
    const selectorKey = document.querySelectorAll(key)
    const listKeys = Array.prototype.map.call(selectorKey, el => el && el.textContent);
    const selectorValue = document.querySelectorAll(value)
    const listValues = Array.prototype.map.call(selectorValue, el => el && el.textContent);

    return listKeys.reduce((acc, item, index) => {
      acc[item] = listValues[index];
      return acc;
    }, {});
  }, key, value);
}

const getUserData = async (browser, id = '') => {
  const page = browser.page;
  console.log(`getting ${id} user data...`)
  const profileUrl = (browser.data && browser.data.personId)
    ? `${url}/${browser.data.personId}`
    : `${url}/${id}`

  const profileRelationship = `${profileUrl}/about?section=relationship`
  await page.goto(profileRelationship, { timeout: 1000000, waitUntil: 'load' });
  await page.screenshot({
    path: `person${id}.png`,
    fullPage: true
  });

  await page.evaluate((romanticRelations) => {
    window.getRelationshipData = (text) => {
      if (text === 'Nenhuma informação de relacionamento a ser exibida') {
        return {}
      }
      if (text === 'Solteiro') {
        return { status: text }
      }
      const textSplitted = splitText(romanticRelations, text);
      return ({
        status: textSplitted[1],
        personName: textSplitted[0],
      });
    }

    window.splitText = (possibleList, text) => possibleList.reduce((acc, item) => {
      const name = text.substring(0, text.search(item));
      return text.includes(item)
        ? [name, item]
        : acc;
    }, [])

    window.getFamilyRelationshipData = (relations, familyRelations) => {
      return relations.map((text) => {
        const textSplitted = splitText(familyRelations, text);
        return {
          name: textSplitted[0],
          relation: textSplitted[1],
        }
      })
    }
  }, familyRelations, romanticRelations);

  const relationshipData = await page.evaluate((profileSelectors, familyRelations) => {
    const romanticRelationshipSelector = document.querySelector(profileSelectors.relashionShip)
    const romanticRelationship = romanticRelationshipSelector && getRelationshipData(romanticRelationshipSelector.textContent)
    const familyRelationshipSelector = document.querySelectorAll(profileSelectors.familyRelationShip)
    const familyRelationshipList = Array.prototype.map.call(familyRelationshipSelector, el => el && el.textContent);

    const familyRelationship = getFamilyRelationshipData(familyRelationshipList, familyRelations)
    return {
      romanticRelationship,
      familyRelationship,
    }
  }, profileSelectors, familyRelations)

  const profileContact = `${profileUrl}/about?section=contact-info`
  await page.goto(profileContact, { timeout: 1000000, waitUntil: 'load' });
  const contactData = await getKeyValueObjBySelector(page, profileSelectors.contactInfoIndex, profileSelectors.contactInfoValue)

  const profileLiving = `${profileUrl}/about?section=living`
  await page.goto(profileLiving, { timeout: 1000000, waitUntil: 'load' });
  const livingData = await getKeyValueObjBySelector(page, profileSelectors.cityValue, profileSelectors.cityIndex)

  const profileEducation = `${profileUrl}/about?section=education`
  await page.goto(profileEducation, { timeout: 1000000, waitUntil: 'load' });
  const educationData = await getKeyValueObjBySelector(page, profileSelectors.educationIndex, profileSelectors.educationValue)

  const name = await page.evaluate((profileSelectors) => {
    const nameSelector = document.querySelector(profileSelectors.name)
    return nameSelector && nameSelector.textContent;
  }, profileSelectors);

  await page.screenshot({
    path: 'person.png',
    fullPage: true
  });

  return {
    ...relationshipData,
    ...contactData,
    ...livingData,
    ...educationData,
    name,
    age: contactData['Data de nascimento'] && contactData['Data de nascimento'].length > 4
      ? getAge(contactData['Data de nascimento'])
      : null
  }
}

const getMembersData = async (browser, groupUrl) => {
  const page = browser.page;
  await page.goto(`${groupUrl}/members/`, { waitUntil: 'load' });
  await scrollToBottom(page);
  await page.screenshot({
    path: 'groupmembers.png',
    fullPage: true
  });
  const membersLinks = await page.evaluate((groupSelectors) => {
    const memberImg = document.querySelectorAll(groupSelectors.memberListName);
    const memberImgExtended = document.querySelectorAll(groupSelectors.memberListNameExtended);
    const allMembers = document.querySelectorAll(groupSelectors.memberAllListName);

    const memberImgLinks = Array.prototype.map.call(memberImg, el => el.getAttribute('href'))
    const memberImgExtendedLinks = Array.prototype.map.call(memberImgExtended, el => el.getAttribute('href'))
    const memberImgAllLinks = Array.prototype.map.call(allMembers, el => el.getAttribute('href'))

    return memberImgLinks
      .concat(memberImgExtendedLinks)
      .concat(memberImgAllLinks);
  }, groupSelectors);

  return Promise.all(membersLinks.map(async (link) => {
    const profileId = link.split('?')[0].substring(25);
    await page.waitFor(3000);
    return getUserData(browser, profileId)
  }));
}

const getGroupData = async (browser) => {
  const page = browser.page;
  const groupUrl = `${url}/groups/${browser.data.groupId}`;
  await page.goto(groupUrl, { waitUntil: 'load' });

  await scrollToBottom(page);
  await clickAllButtons(page, groupSelectors.moreCommentsButton);
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

  if (postArticleIds.length === 0) {
    console.error('Something is wrong! Maybe you don\'t have access to this group');
  }

  const groupPostIds = [
    ...postArticleIds,
    ...postFeedIds,
  ]
  console.log('Getting the posts data...')
  const posts = await getPostData(page, groupPostIds);
  console.log('Getting members data...')
  const members = await getMembersData(browser, groupUrl);
  return {
    posts,
    members,
  }
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
  getGroupData,
  getUserData,
  saveAsJson,
};