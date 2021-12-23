import fs from 'fs';
import express from 'express';
import path from 'path';
import chalk from 'chalk';

let __dirname = path.resolve(path.dirname(''));
const app = express();

for (let i of fs.readdirSync('./rss/')) {
	let filename = i.split('.')[0].toLowerCase();
	app.get(`/${filename}`, (_req, res) => {
		res.sendFile(`./rss/${i}`, { root: __dirname });
	});
}

app.listen(3000, () => {
	console.log(chalk.blue('[SERV]') + ' Serving RSS files at port 3000.');
});
