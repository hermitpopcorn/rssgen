import RSS from 'rss-generator';
import axios from 'axios';
import fs from 'fs';

const store = { manga: {}, group: {} };
async function getMangaTitle(id) {
	if (store.manga[id]) { return store.manga[id]; }

	const { data: manga } = await axios.get(`https://api.mangadex.org/manga/${id}`);
	store.manga[id] = manga.data.attributes.title.en;
	return store.manga[id];
};
async function getGroupName(id) {
	if (store.group[id]) { return store.group[id]; }

	const { data: group } = await axios.get(`https://api.mangadex.org/group/${id}`);
	store.group[id] = group.data.attributes.name;
	return store.group[id];
};

function makeTitle(mangaTitle, volume, chapter) {
	let title = `${mangaTitle} `;
	if (volume) {
		title = `${title}v${volume}`;
	}
	return `${title}c${chapter}`;
};
function makeDescription(chapterTitle, groupName) {
	let desc = '';
	if (chapterTitle) {
		desc = `<strong>${chapterTitle}</strong><br>`;
	}
	return `${desc}Scanlated by ${groupName}`;
};

function generateRSS(chapters) {
	const feed = new RSS({
		title: 'MangaDex Feed',
		site_url: 'https://mangadex.org/titles/feed',
	});

	for (let i of chapters) {
		feed.item(i);
	}
	
	return fs.writeFileSync(`./rss/MangaDex.rss`, feed.xml());
}

export default async () => {
	try {
		
		console.log('[MDEX] Logging in...');
		const { data: login } = await axios.post('https://api.mangadex.org/auth/login', {
			username: process.env.MANGADEX_USERNAME,
			password: process.env.MANGADEX_PASSWORD,
		});

		const token = login.token.session;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

		console.log('[MDEX] Fetching feed...');
		const { data: feed } = await axios({
			method: 'get',
			url: 'https://api.mangadex.org/user/follows/manga/feed',
			params: {
				'translatedLanguage[]': 'en',
				'order[createdAt]': 'desc',
				'limit': 50,
			},
		});

		const final = new Array();
		for (let chapter of feed.data) {
			let groupName, mangaTitle;
			for (let relationship of chapter.relationships) {
				if (relationship.type === 'scanlation_group' && groupName === undefined) {
					groupName = await getGroupName(relationship.id);
				} else
				if (relationship.type === 'manga' && mangaTitle === undefined) {
					mangaTitle = await getMangaTitle(relationship.id);
				}
			}

			const i = {
				guid: chapter.id,
				date: new Date(chapter.attributes.createdAt),
				title: makeTitle(mangaTitle, chapter.attributes.volume, chapter.attributes.chapter),
				description: chapter.attributes.title,
				author: groupName,
				url: `https://mangadex.org/chapter/${chapter.id}`,
			};
			if (chapter.attributes.title) {
				i.description = chapter.attributes.title;
			}
			final.push(i);
		}

		console.log('[MDEX] Generating RSS...');
		generateRSS(final);
		console.log('[MDEX] RSS file created.');

		return true;
	} catch(e) {
		if (axios.isAxiosError(e)) {
			console.log('[MDEX] Request error: '.concat(e.message));
			console.log('[MDEX] Response body:');
			console.log(e.response.data);
			return false;
		} else {
			throw e;
		}
	}
};
