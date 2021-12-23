import chalk from 'chalk';
import {} from 'dotenv/config';
import fs from 'fs';
import ftpClient from 'ftp';
import path from 'path';

let __dirname = path.resolve(path.dirname(''));

const ftp = new ftpClient();

const files = fs.readdirSync('./rss/').filter((file) => path.extname(file).toLowerCase() === '.rss');

ftp.on('ready', () => {
	for (let i of files) {
		ftp.put(`./rss/${i}`, process.env.FTP_PATH.concat(i), false, (error) => {
			if (error) {
				console.error(chalk.blue('[UPLD]') + chalk.red(` Error: ${error.message}`));
			}
			console.log(chalk.blue('[UPLD]') + ` Uploaded ${i}.`);
		});
	}
	ftp.end();
});

console.log(chalk.blue('[UPLD]') + ' Connecting to FTP...');
ftp.connect({
	host: process.env.FTP_HOST,
	port: Number(process.env.FTP_PORT),
	user: process.env.FTP_USERNAME,
	password: process.env.FTP_PASSWORD,
});
