import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'RedDeer', async () => {
		let data = [];

		let body = await (await fetch('https://data.reddeer.ca/datasets')).text();
		const $ = cheerio.load(body);

		const rows = $('tr');

		for (let i = 0; i < rows.length; i++) {
			const urlSpan = $(rows[i]).find('td')[3];
			if (urlSpan) {
				const urlText = $(urlSpan).find('.label-category').text();
				if (urlText && urlText === 'GIS') {
					if ($(rows[i]).find('.mb5').find('a').attr('href') !== '/orthophotography') {
						const url = $(rows[i]).find('.mb5').find('a').attr('href');

						const api = await (await fetch('https://data.reddeer.ca' + url)).text().then(info => {
							const $ = cheerio.load(info);
							const divs = $('div');
							const table = $(divs).find('.dataset-table-data');
							let rows = $(table).find('tr');

							for (let i = 0; i < rows.length; i++) {
								const urlSpan = $(rows[i]).find('td')[1];
								if (urlSpan) {
									const urlText = $(urlSpan).find('a').attr('href');
									if (urlText) {
										return urlText;
									}
								}
							}
						});

						const metadata = await (await fetch(api)).json();

						data.push({
							url: 'https://data.reddeer.ca/datasets' + url + '/download/shapefile',
							updated:
                metadata.lastUpdateDate !== 'Live'
                	? new Date(metadata.lastUpdateDate).getTime()
                	: Date.now(),
							created: new Date(metadata.createdDate).getTime(),
							description:
                metadata.description +
                'This data is provided by <a href="https://data.reddeer.ca/">https://data.reddeer.ca/</a>.',
							name: metadata.name,
						});
					}
				}
			}
		}

		return data;
	});
};
