import fs from 'fs';
import util from 'util';

import elements from './helpers/elements';
import options from './helpers/options';
import getAge from './helpers/dateUtil';
import actions from './actions'
import { error, debug, success } from './helpers/logs';

const { ptBr } = options;
const {
  familyRelations,
  romanticRelations,
} = ptBr;

const {
  url,
  loginSelectors,
  groupSelectors,
  profileSelectors,
  postSelectors,
} = elements;

const {
  focusSelector,
  writeForm,
  // clickButton,
  scrollToBottom,
  clickAllButtons,
  getKeyValueObjBySelector,
  getObjBySelectorWithDivider,
} = actions
 
/**
 * @param  {object} browser
 * @returns Browser
 */
const login = async (browser) => {
  debug('Logging you in under your credentials...\n')
  const page = browser.page;
  await page.goto(url, { waitUntil: 'load' });
  await focusSelector(page, loginSelectors.userForm);
  await writeForm(page, loginSelectors.userForm, browser.data.username);
  await focusSelector(page, loginSelectors.passForm);
  await writeForm(page, loginSelectors.passForm, browser.data.password);
  await page.keyboard.press('Enter');
  // await clickButton(page, loginSelectors.loginButton);
  await page.waitForNavigation({ timeout: 1000000, waitUntil: 'load' });
  await page.screenshot({
    path: 'login.png',
    fullPage: true
  });
  success('Done!\n')
  return browser;
};

/**
 * @param  {object} page
 * @param  {array} postsIds 
 * @returns Promise
 */
const getPostData = async (page, postsIds) => {
  const posts = postsIds && postsIds.map(async id => {
    if (typeof id === 'string') {
      const selector = groupSelectors.groupPostDiv(id);
      return page.evaluate((selector, postSelectors) => {
        const getText = (div) => {

          const bigText = div.querySelector(postSelectors.postBigText)
            ? div.querySelector(postSelectors.postBigText).textContent
            : ''
          const text = div.querySelector(postSelectors.postText)
            ? div.querySelector(postSelectors.postText).textContent
            : ''

          const img = div.querySelector(postSelectors.postImg)
            && div.querySelector(postSelectors.postImg).getAttribute('src')
          const linkImg = div.querySelector(postSelectors.postLinkImg)
          && div.querySelector(postSelectors.postLinkImg).getAttribute('src')

          const link = div.querySelector(postSelectors.postLink)
          && div.querySelector(postSelectors.postLink).getAttribute('href')

          const author = div.querySelector(postSelectors.postsAuthor);
          const date = div.querySelector(postSelectors.postDate)
          return {
            op: author && author.textContent,
            date: date && date.textContent,
            text: bigText || text,
            img: linkImg || img,
            link,
          };
        };
        const getComments = (div) => {
          const commentSpans = div.querySelectorAll(postSelectors.commentText);
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
      }, selector, postSelectors);
    }
  });
  return Promise.all(posts)
};

/**
 * @param  {object} browser
 * @param  {string} id 
 * @returns Promise
 */
const getUserData = async (browser, id = '') => {
  const page = browser.page;
  debug(`getting ${id} user data...`)
  const profileUrl = (browser.data && browser.data.personId)
    ? `${url}/${browser.data.personId}`
    : `${url}/${id}`

  const profileRelationship = `${profileUrl}/about?section=relationship`
  await page.goto(profileRelationship, { timeout: 1000000, waitUntil: 'load' });

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
      return relations && relations.map((text) => {
        const textSplitted = splitText(familyRelations, text);
        return {
          name: textSplitted[0],
          relation: textSplitted[1],
        }
      })
    }
  }, romanticRelations);

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
  const contactsList = await getKeyValueObjBySelector(page, profileSelectors.contactInfoIndex, profileSelectors.contactInfoValue)
  const contactData = {
    basicInfo: contactsList,
  }

  const profileLiving = `${profileUrl}/about?section=living`
  await page.goto(profileLiving, { timeout: 1000000, waitUntil: 'load' });
  const livingData = await getKeyValueObjBySelector(page, profileSelectors.cityValue, profileSelectors.cityIndex)

  const profileEducation = `${profileUrl}/about?section=education`
  await page.goto(profileEducation, { timeout: 1000000, waitUntil: 'load' });
  
  const listOfExperience = await getObjBySelectorWithDivider(page, profileSelectors.educationLists, profileSelectors.educationIndex, profileSelectors.educationValue)
  const educationData = {
    work: listOfExperience[0],
    skills: listOfExperience[1],
    education: listOfExperience[2],
  }

  const name = await page.evaluate((profileSelectors) => {
    const nameSelector = document.querySelector(profileSelectors.name)
    return nameSelector && nameSelector.textContent;
  }, profileSelectors);

  const posts = browser.data && browser.data.posts
    ? await getUserPostsData(browser, id)
    : {}

  return {
    ...relationshipData,
    ...contactData,
    ...livingData,
    ...educationData,
    ...posts,
    name,
    age: contactData['Data de nascimento'] && contactData['Data de nascimento'].length > 4
      ? getAge(contactData['Data de nascimento'])
      : null
  }
}

/**
 * @param  {object} browser
 * @param  {string} groupUrl 
 * @returns Array
 */
const getMembersData = async (browser, groupUrl) => {
  const page = browser.page;
  await page.goto(`${groupUrl}/members/`, { waitUntil: 'load' });
  await scrollToBottom(page);
  const membersLinks = await page.evaluate((groupSelectors) => {
    const memberImg = document.querySelectorAll(groupSelectors.memberListName);
    const memberImgExtended = document.querySelectorAll(groupSelectors.memberListNameExtended);
    const allMembers = document.querySelectorAll(groupSelectors.memberAllListName);

    const memberImgLinks = Array.prototype.map.call(memberImg, el => el.getAttribute('href'))
    const memberImgExtendedLinks = Array.prototype.map.call(memberImgExtended, el => el.getAttribute('href'))
    const memberImgAllLinks = Array.prototype.map.call(allMembers, el => el.getAttribute('href'))

    return memberImgLinks
      .concat(memberImgExtendedLinks)
      .concat(memberImgAllLinks)
      .map(link => link.split('?')[0].substring(25));
  }, groupSelectors);

  let membersData = [];
  if (membersLinks) {
    for (let i = 0; i < membersLinks.length; i++) {
      const memberData = await getUserData(browser, membersLinks[i]);
      membersData.push(memberData);
    }
  }

  return membersData;
}

/**
 * TODO
 * @param  {object} browser
 * @param  {string} personId 
 */
const getUserPostsData = async (browser, personId) => {
  const page = browser.page;
  const personFeedUrl = `${url}/${personId}`;
  await page.goto(personFeedUrl, { waitUntil: 'load' });

  // await scrollToBottom(page);
  await clickAllButtons(page, postSelectors.moreCommentsButton);
  await page.waitFor(3000);
}

/**
 * @param  {object} browser
 * @retuns Object
 */
const getGroupData = async (browser) => {
  const page = browser.page;
  const groupUrl = `${url}/groups/${browser.data.groupId}`;
  await page.goto(groupUrl, { waitUntil: 'load' });
  await scrollToBottom(page);

  let groupPostIds = []
  await page.waitFor(3000);
  try {
  // TODO: Click to open all comment responses
    await clickAllButtons(page, postSelectors.moreCommentsButton);
    const postValues = await page.$$eval(groupSelectors.postSelector, e => e);
  
    const postFeedValues = await page.$$eval(groupSelectors.postFeedSelector, e => e);
    const getIdOfSelector = item => item && item.__FBSTORE && JSON.parse(item.__FBSTORE['data-ft'])['mf_story_key'];
    const postArticleIds = postValues ? postValues.map(getIdOfSelector) : []
    const postFeedIds = postFeedValues ? postFeedValues.map(getIdOfSelector) : []
    if (postArticleIds.length === 0) {
      error('Something is wrong! Maybe you don\'t have access to this group');
    }

    groupPostIds = [
      ...postArticleIds,
      ...postFeedIds,
    ]
  } catch (e) {
    error(e);
    throw e;
  }

  debug('Getting the posts data...\n')
  const posts = await getPostData(page, groupPostIds);
  debug('Getting members data...\n')
  
  const membersData = browser.data && browser.data.members
    ? { members: await getMembersData(browser, groupUrl)}
    : {}
  return {
    posts,
    ...membersData,
  }
};

/**
 * @param  {object} obj
 * @retuns Object
 */
const saveAsJson = async (obj) => {
  debug('Saving data as json!')
  const write = util.promisify(fs.writeFile);
  await write('data.json', JSON.stringify(obj), 'utf8');
  success('Saved as data.json!');
  return obj
};

export {
  login,
  getGroupData,
  getMembersData,
  getUserData,
  getPostData,
  saveAsJson,
};