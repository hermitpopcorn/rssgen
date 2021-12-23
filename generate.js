import {} from 'dotenv/config';
import startCrawls from './gofer.js';
import getMangadexFeed from './mangadex.js';

console.log('[GENR] Generator started.');

const goferCrawl = startCrawls();

await Promise.allSettled([goferCrawl]);

console.log('[GENR] Generator finished.');
