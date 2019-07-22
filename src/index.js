import scrap from './scrap';

const test = async () => {
  const scrapper = await scrap();
  try {
    await scrapper.login()
    await scrapper.close()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

test();