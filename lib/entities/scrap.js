import { pipeP } from 'ramda';

import browserInit from './browser';

import {
  login,
  getGroupData,
  getUserData,
  getMembersData,
  saveAsJson,
} from '../main';

const scrap = async (config) => {
  const browser = await browserInit(config);
  const doLogin = pipeP(
    login,
  )
  const getGroup = pipeP(
    login,
    getGroupData,
    saveAsJson,
  )
  const getGroupMembers = pipeP(
    login,
    getMembersData,
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
    getGroup: async () => {
      try {
        await getGroup(browser);
        browser.close()
      } catch (e) {
        throw `Could not getPosts \n ${e}`
      }
    },
    getGroupMembers: async () => {
      try {
        await getGroupMembers(browser);
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