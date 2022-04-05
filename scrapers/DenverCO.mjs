import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'DenverCO', async () => {
		const results = [];
		const baseUrl = 'https://www.denvergov.org';
		const request = await fetch(`${baseUrl}/opendata/dataset/city-and-county-of-denver-parcels`);
		const response = await request.text();
		const $ = cheerio.load(response);
		const updatedString = $('.tagline').text().trim();
		const description = $('.notes > p').text();
		const resources = $('a[data-resource]');
		const [, date] = updatedString.split('Last updated');
		const updated = moment(date, 'M/D/YYYY').unix();

		resources.map((index, elem) => {
			const name = $(elem).attr('data-resource');
			const url = $(elem).attr('href');
			return results.push({
				url,
				updated,
				created: 0,
				description,
				name,
			});
		});

		return results;
	});
};
