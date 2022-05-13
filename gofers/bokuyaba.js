import Mangacross from './_mangacross.js';

var manga = 'Bokuyaba';
var url = 'https://mangacross.jp/comics/yabai';

export default {
	manga: manga,
	url: url,

	crawl: () => { return Mangacross(manga, url); },
};
