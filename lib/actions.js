import elements from './helpers/elements';
import { debug, error } from './helpers/logs';

import { TimeoutError } from 'puppeteer/Errors';

const {
  argumentSelector
} = elements;

/**
 * @param  {object} page
 * @param  {string} element
 * @returns Object
 */
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

/**
 * @param  {object} page
 * @param  {string} element
 * @param  {string} input
 * @returns Object
 */
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

/**
 * @param  {object} page
 * @param  {string} element
 * @returns Object
 */
const clickButton = async (page, element) => {
  let i = 0;
  while (i < page.retryCount) {
    try {
      await page.click(element);
    } catch (e) {
      if (e instanceof TimeoutError) {
        i++;
        if (i === page.retryCount) {
          throw e;
        }
      }
    }
  }
  return page;
}

/**
 * @param  {object} page
 */
const scrollToBottom = async (page) => {
  debug('Scrolling the page...\n this might take a while!\n')
  const distance = 100; // should be less than or equal to window.innerHeight
  const delay = 1000;
  while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
    let i = 0;
    while (i < page.retryCount) {
      try {
        await page.evaluate((y) => {
          document.scrollingElement.scrollBy(0, y);
        }, distance);
    
        const previousHeight = await page.evaluate(
          'document.body.scrollHeight'
        );
        
        await page.waitFor(delay);
    
        await page.waitForFunction(
          `document.body.scrollHeight > ${previousHeight}`,
          {timeout: 600000})
          .catch(() => error('Scroll failed'));
      } catch (e) {
        i++;
        if (i === page.retryCount) {
          throw e;
        }
      }
    }
  }
};

/**
 * @param  {object} page
 * @param  {string} element
 */
const clickAllButtons = async (page, element) => {
  let i = 0;
  while (i < page.retryCount) {
    try {
      return page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector);
        return Promise.all(Array.prototype.map.call(elements, e => e.click()));
      }, element)
    } catch (e) {
      if (e instanceof TimeoutError) {
        i++;
        if (i === page.retryCount) {
          throw e;
        }
      }
    }
  }
}

/**
 * @param  {object} page
 * @param  {string} divider
 * @param  {string} key
 * @param  {string} value 
 * @returns Array 
 */
const getObjBySelectorWithDivider = (page, divider, key, value) => {
  let i = 0;
  while (i < page.retryCount) {
    try {
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
    } catch (e) {
      if (e instanceof TimeoutError) {
        i++;
        if (i === page.retryCount) {
          throw e;
        }
      }
    }
  }
}

/**
 * @param  {object} page
 * @param  {string} key
 * @param  {string} value 
 * @returns Promise
 */
const getKeyValueObjBySelector = (page, key, value) => {
  let i = 0;
  while (i < page.retryCount) {
    try {
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
    } catch (e) {
      if (e instanceof TimeoutError) {
        i++;
        if (i === page.retryCount) {
          throw e;
        }
      }
    }
  }
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