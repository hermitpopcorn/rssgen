import puppeteer from 'puppeteer-core';
import { JSDOM } from 'jsdom';
import chalk from 'chalk';

export default (manga, url) => {
	return new Promise(async (resolve, reject) => {
		var browser
		var page
		try {
			browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true });
			page = await browser.newPage();
		} catch (e) {
			console.log(chalk.blue('[GOFR]') + ` ${manga}: Error launching headed browser.`);
			return reject(e);
		}
		try {
			await page.goto(url, { waitUntil: 'load' });
		} catch (e) {
			if (e instanceof puppeteer.errors.TimeoutError) {
				console.log(chalk.blue('[GOFR]') + ` ${manga}: Timeouted but continuing anyway.`);
			} else {
				await browser.close();
				return reject(e);
			}
		}

		const chapters = new Array();
		await page.waitForSelector('li.episode-list__item').then(async (ul) => {
			await new Promise((r) => setTimeout(() => r(), 2000)); // wait for good measure
			const chapterListDOM = new JSDOM(await ul.evaluate((node) => node.parentElement.outerHTML)).window.document;
			chapterListDOM.querySelectorAll('li.episode-list__item').forEach((element) => {
				const linkDOM = element.querySelector('a');
				const titleDOM = element.querySelector('div.episode-list__number');
				if (linkDOM && titleDOM) {
					chapters.push({
						manga: manga,
						url: 'https://mangacross.jp'.concat(linkDOM.href),
						title: titleDOM.innerHTML,
					});
				}
			});
		});
	
		await browser.close();
		resolve(chapters);
	});
};
