import scrap from './scrap';

const test = async () => {
  const scrapper = await scrap();
  try {
    await scrapper.goTo('https://example.com');
    await scrapper.close();
  } catch (e) {
    console.error(`Error trying to scrape! :(\n${e}`);
  }
};

test();