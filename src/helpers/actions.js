import elements from './elements';
import { debug } from './logs';

import { TimeoutError } from 'puppeteer/Errors';

const {
  argumentSelector
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

const scrollToBottom = async (page) => {
  debug('Scrolling the facebook group...\n this might take a while!')
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

const getObjBySelectorWithDivider = (page, divider, key, value) => {
  return page.evaluate((key, value, divider) => {
    const contentDivider = document.querySelectorAll(divider)
    return Array.prototype.map.call(contentDivider, el => {
      const selectorKey = el.querySelectorAll(key)
      const listKeys = Array.prototype.map.call(selectorKey, el => el && el.textContent);
      const selectorValue = el.querySelectorAll(value)
      const listValues = Array.prototype.map.call(selectorValue, el => el && el.textContent);  
      return listKeys.reduce((acc, item, index) => {
        acc.push({
          title: item,
          subtitle: listValues[index]
        })
        return acc;
      }, []);
    })
  }, key, value, divider);
}

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

export default {
  focusSelector,
  writeForm,
  clickButton,
  scrollToBottom,
  clickAllButtons,
  getKeyValueObjBySelector,
  getObjBySelectorWithDivider,
}