import {} from 'dotenv/config';
import startCrawls from './gofer.js';
import getMangaDexFeed from './mangadex.js';

console.log('[GENR] Generator started.');

const goferCrawl = startCrawls();
const dexFeed = getMangaDexFeed();

await Promise.allSettled([goferCrawl, dexFeed]);

console.log('[GENR] Generator finished.');
