import Mangacross from './_mangacross.js';

var manga = 'Negasuki';
var url = 'https://mangacross.jp/comics/negasuki';

export default {
	manga: manga,
	url: url,

	crawl: () => { return Mangacross(manga, url); },
};
