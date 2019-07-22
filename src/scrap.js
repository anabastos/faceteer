import puppeteer from 'puppeteer';
import { pipeP } from 'ramda';

import {
  getPage,
  login,
  fetchAllPosts,
  saveAsJson,
} from './helper';

const scrap = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-notifications', '--start-maximized'],
  });
  const doLogin = pipeP(
    getPage,
    login,
    fetchAllPosts,
    saveAsJson,
  )
  const getPosts = pipeP(
    getPage,
    login,
    fetchAllPosts,
    saveAsJson,
  )
  return {
    login: async () => {
      try {
        await doLogin(browser);
      } catch (e) {
        throw `Could not login \n ${e}`
      }
    },
    getPosts: async () => {
      try {
        await getPosts(browser);
      } catch (e) {
        throw `Could not getPosts \n ${e}`
      }
    },
    close: async () => await browser.close(),
  }
};

export default scrap;