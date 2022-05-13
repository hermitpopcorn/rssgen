import {} from 'dotenv/config';
import startCrawls from './gofer.js';
import getMangaDexFeed from './mangadex.js';
import chalk from 'chalk';

console.log(chalk.green('[GENR]') + ' Generator started.');

let promises = [];

const goferCrawl = startCrawls();
promises.push(goferCrawl);

if (process.env.GET_MANGADEX) {
	const dexFeed = getMangaDexFeed();
	promises.push(dexFeed);
}

await Promise.allSettled(promises);

console.log(chalk.green('[GENR]') + ' Generator finished.');
