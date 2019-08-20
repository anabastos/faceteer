import chalk from 'chalk';

const error = msg => console.log(chalk.bold.red(msg));
const warning = msg => console.log(chalk.keyword('orange')(msg));
const debug = msg => console.log(chalk.white.bgMagenta(msg))
const success = msg => console.log(chalk.white.bgGreen(msg))

export {
  error,
  warning,
  debug,
  success,
};