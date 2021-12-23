import {} from 'dotenv/config';
import startCrawls from './gofer.js';
import getMangaDexFeed from './mangadex.js';
import chalk from 'chalk';

console.log(chalk.green('[GENR]') + ' Generator started.');

const goferCrawl = startCrawls();
const dexFeed = getMangaDexFeed();

await Promise.allSettled([goferCrawl, dexFeed]);

console.log(chalk.green('[GENR]') + ' Generator finished.');
