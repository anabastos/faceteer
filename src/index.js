import prog from 'caporal';

import scrap from './helpers/scrap';

const pkg = require('../package.json');

const init = async (config) => {
  const scrapper = await scrap(config);
  try {
    // await scrapper.login()
    // await scrapper.getPosts()
    await scrapper.getUser()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

prog
  .version(pkg.version)
  .description('Facebook Scrapper!')
  .command('pfg', 'Pup facebook group')
  .argument('<username>', 'Facebook Username')
  .argument('<password>', 'Facebook Password')
  .argument('<personId>', 'Profile id')
  // .argument('<groupId>', 'Facebook Group id')
  .option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  .action((args) => {
    init(args);
  });

prog.parse(process.argv);