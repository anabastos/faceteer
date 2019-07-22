import { pipeP } from 'ramda';

import browserInit from './browser';

import {
  login,
  fetchAllPosts,
  saveAsJson,
} from '../helper';

const scrap = async (config) => {
  const browser = await browserInit(config);
  const doLogin = pipeP(
    login,
  )
  const getPosts = pipeP(
    login,
    fetchAllPosts,
    saveAsJson,
  )
  return {
    login: async () => {
      try {
        await doLogin(browser);
        browser.close()
      } catch (e) {
        throw `Could not login \n ${e}`
      }
    },
    getPosts: async () => {
      try {
        await getPosts(browser);
        browser.close()
      } catch (e) {
        throw `Could not getPosts \n ${e}`
      }
    },
  }
};

export default scrap;