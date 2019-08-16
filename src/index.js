import prog from 'caporal';

import scrap from './entities/scrap';

const pkg = require('../package.json');

const initScrap = (args, options) => {
  const config = {
    ...args,
    ...options,
  }
  return scrap(config);
};

const getUserCommand = (args, options) => {
  const scrapper = await initScrap(args, options);
  try {
    await scrapper.login()
    await scrapper.getUser()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

const getGroupCommand = (args, options) => {
  const scrapper = await initScrap(args, options);
  try {
    await scrapper.login()
    await scrapper.getGroup()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

prog
  .version(pkg.version)
  .description('Facebook Group Scrapper!')
  .command('group', 'Scrape facebook group data')
  .alias('g')
  .argument('<username>', 'Facebook Username')
  .argument('<password>', 'Facebook Password')
  .argument('<groupId>', 'Facebook Group id')
  .option('--members <members>', 'If it should get group <members> data. Default is false.', prog.BOOL)
  .action((args, options) => {
    getGroupCommand(args, options);
  })
  .command('profile', 'Scrape facebook profile data')
  .alias('p')
  .argument('<username>', 'Facebook Username')
  .argument('<password>', 'Facebook Password')
  .argument('<personId>', 'Facebook Profile id or username')
  .option('--posts <posts>', 'If it should include <posts> data. Default is false.', prog.BOOL)
  .action((args, options) => {
    getUserCommand(args, options);
  });

prog.parse(process.argv);