import prog from 'caporal';

import scrap from './entities/scrap';
import { success } from './helpers/logs'

const pkg = require('../package.json');

/**
 * @param  {object} args
 * @param  {object} options 
 * @retuns Object
 */
const initScrap = (args, options) => {
  const config = {
    ...args,
    ...options,
  }

  success('__________________________________________')    
  success('  ____                 __                 ')
  success('  / __/___ _ ____ ___  / /_ ___  ___  ____')
  success(' / _/ / _ `// __// -_)/ __// -_)/ -_)/ __/')
  success('/_/   \\_,_/ \\__/ \\__/ \\__/ \\__/ \\__//_/   ')       
  success('__________________________________________')        
  success('-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-')
  success('__________________________________________')
  
  return scrap(config);
};

/**
 * @param  {object} args
 * @param  {object} options 
 * @retuns Object
 */
const getUserCommand = async (args, options) => {
  const scrapper = await initScrap(args, options);
  try {
    await scrapper.getUser()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

/**
 * @param  {object} args
 * @param  {object} options 
 * @retuns Object
 */
const getGroupCommand = async (args, options) => {
  const scrapper = await initScrap(args, options);
  try {
    await scrapper.getGroup()
  } catch (e) {
    throw `Error trying to scrape: ${e}`;
  }
};

/**
 * @param  {object} args
 * @param  {object} options 
 * @retuns Object
 */
const getGroupMembersCommand = async (args, options) => {
  const scrapper = await initScrap(args, options);
  try {
    await scrapper.getGroupMembers()
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
  .option('--members <members>', `If it should get 
group <members> data. Default is false.`, prog.BOOL)
  .option('--debug <debug>', `Show <debug> logs.
Default is false.`, prog.BOOL)
  .action((args, options) => {
    getGroupCommand(args, options);
  })
  .command('profile', 'Scrape facebook profile data')
  .alias('p')
  .argument('<username>', 'Facebook Username')
  .argument('<password>', 'Facebook Password')
  .argument('<personId>', 'Facebook Profile id or username')
  .option('--posts <posts>', `If it should include <posts> data.
Default is false.', prog.BOOL`)
  .option('--debug <debug>', 'Show <debug> logs. Default is false.', prog.BOOL)
  .action((args, options) => {
    getUserCommand(args, options);
  })
  .command('groupmembers', 'Scrape facebook group members data')
  .alias('gm')
  .argument('<username>', 'Facebook Username')
  .argument('<password>', 'Facebook Password')
  .argument('<groupId>', 'Facebook Profile id or username')
  .option('--debug <debug>', 'Show <debug> logs. Default is false.', prog.BOOL)
  .action((args, options) => {
    getGroupMembersCommand(args, options);
  });

prog.parse(process.argv);