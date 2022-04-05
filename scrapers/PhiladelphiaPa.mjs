import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'PhiladelphiaPa', async () => {
		const results = [];
		const baseUrl = 'https://www.opendataphilly.org';
		const request = await fetch(`${baseUrl}/dataset/property-parcels`);
		const response = await request.text();
		const $ = cheerio.load(response);

		const datasetResources = $('#dataset-resources li');
		const description = $('.notes p').text();
		const [date] = $('.automatic-local-datetime').text().trim().split('(UTC');

		const created = moment(date, 'MMMM D, YYYY, H').unix();

		for (let index = 0; index < datasetResources.length; index++) {
			const elem = datasetResources[index];
			const href = $(elem).find('a.heading').attr('href');
			const name = $(elem).find('a.heading').attr('title');
			const url = `${baseUrl}/${href}`;
			if (href !== undefined) {
				results.push({
					url,
					updated: 0,
					created,
					description,
					name,
				});
			}
		}

		return results;
	});
};
