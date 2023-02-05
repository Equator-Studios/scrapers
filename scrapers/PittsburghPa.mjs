import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'PittsburghPa', async () => {
		const results = [];
		const baseUrl = 'https://data.wprdc.org';
		const request = await fetch(`${baseUrl}/dataset/allegheny-county-parcel-boundaries1`);
		const response = await request.text();
		const $ = cheerio.load(response);

		const datasetResources = $('#dataset-resources li');
		const description = $('.notes p').text();
		const createdString = $('section.additional-info > table > tbody > tr:nth-child(4) > td').text();
		const updatedString = $('section.additional-info > table > tbody > tr:nth-child(5) > td').text();

		const created = moment(createdString, 'MMMM D, YYYY, hh:mm A').unix();
		const updated = moment(updatedString, 'MMMM D, YYYY, hh:mm A').unix();

		for (let index = 0; index < datasetResources.length; index++) {
			const elem = datasetResources[index];
			const href = $(elem).find('a.heading').attr('href');
			const name = $(elem).find('a.heading').attr('title');
			const url = `${baseUrl}/${href}`;
			if (href !== undefined) {
				results.push({
					url,
					updated,
					created,
					description,
					name,
				});
			}
		}

		return results;
	});
};
