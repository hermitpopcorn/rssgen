import puppeteer from 'puppeteer-core';
import { JSDOM } from 'jsdom';

export default {
	manga: 'Bokuyaba',
	url: 'https://mangacross.jp/comics/yabai',

	crawl: () => {
		return new Promise(async (resolve) => {
			const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true });
			const page = await browser.newPage();
			await page.goto('https://mangacross.jp/comics/yabai', { waitUntil: 'load' });

			const chapters = new Array();
			await page.waitForSelector('li.episode-list__item').then(async (ul) => {
				await new Promise((r) => setTimeout(() => r(), 2000)); // wait for good measure
				const chapterListDOM = new JSDOM(await ul.evaluate((node) => node.parentElement.outerHTML)).window.document;
				chapterListDOM.querySelectorAll('li.episode-list__item').forEach((element) => {
					const linkDOM = element.querySelector('a');
					const titleDOM = element.querySelector('div.episode-list__number');
					if (linkDOM && titleDOM) {
						chapters.push({
							manga: 'Bokuyaba',
							url: 'https://mangacross.jp'.concat(linkDOM.href),
							title: titleDOM.innerHTML,
						});
					}
				});
			});
		
			await browser.close();
			resolve(chapters);
		});
	},
};
