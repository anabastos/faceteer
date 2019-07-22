import scrap from './helpers/scrap';

const init = async (config) => {
  const scrapper = await scrap(config);
  try {
    // await scrapper.login()
    await scrapper.getPosts()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

init({
  username: '',
  password: '',
  groupId: '',
});