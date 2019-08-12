import { pipeP } from 'ramda';

import browserInit from './browser';

import {
  login,
  getGroupData,
  getUserData,
  saveAsJson,
} from '../main';

const scrap = async (config) => {
  const browser = await browserInit(config);
  const doLogin = pipeP(
    login,
  )
  const getPosts = pipeP(
    login,
    getGroupData,
    saveAsJson,
  )
  const getUser = pipeP(
    login,
    getUserData,
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
    getUser: async () => {
      try {
        await getUser(browser);
        browser.close()
      } catch (e) {
        throw `Could not getPosts \n ${e}`
      }
    },
  }
};

export default scrap;