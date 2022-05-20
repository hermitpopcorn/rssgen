import puppeteer from 'puppeteer-core';
import { JSDOM } from 'jsdom';
import { DateTime } from 'luxon';
import chalk from 'chalk';

function parseDate(dateString) {
	const split = dateString.split('.');
	return DateTime.fromObject({ year: Number(split[0]), month: Number(split[1]), day: Number(split[2]) }, { zone: 'Asia/Tokyo' });
};

export default {
	manga: 'Yangaru',
	url: 'https://mangahack.com/comics/7612',
	order: [
		['date', 'DESC'],
		['title', 'DESC'],
	],

	crawl: () => {
		return new Promise(async (resolve, reject) => {
			var browser
			var page
			try {
				browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true });
				page = await browser.newPage();
			} catch (e) {
				console.log(chalk.blue('[GOFR]') + ' Yangaru: Error launching headless browser.');
				return reject(e);
			}
			try {
				await page.goto('https://mangahack.com/comics/7612', { waitUntil: 'domcontentloaded' });
			} catch (e) {
				await browser.close();
				return reject(e);
			}

			const chapters = new Array();
			await page.waitForSelector('div.comicList_box.cf').then(async (ul) => {
				await new Promise((r) => setTimeout(() => r(), 2000)); // wait for good measure
				const chapterListDOM = new JSDOM(await ul.evaluate((node) => node.parentElement.outerHTML)).window.document;
				chapterListDOM.querySelectorAll('div.comicList_box.cf').forEach((element) => {
					const linkDOM = element.querySelector('a');
					const titleDOM = element.querySelector('p.title span a');
					const dateDOM = element.querySelector('div.right ul.cf li');
					if (linkDOM && titleDOM) {
						chapters.push({
							manga: 'Yangaru',
							url: 'https://mangahack.com'.concat(linkDOM.href),
							title: titleDOM.innerHTML,
							date: parseDate(dateDOM.innerHTML),
						});
					}
				});
			});
		
			await browser.close();
			resolve(chapters);
		});
	},
};
