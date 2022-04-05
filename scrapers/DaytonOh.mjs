import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'DaytonOh', async () => {
		const results = [];
		const baseUrl = 'http://www.mcauditor.org';
		const request = await fetch(`${baseUrl}/downloads/gis_download_shape.cfm`);
		const response = await request.text();
		const $ = cheerio.load(response);

		const tableRow = $('table:nth-child(4) > tbody > tr');

		for (let index = 0; index < tableRow.length; index++) {
			const name = $(
        `table:nth-child(4) > tbody > tr:nth-child(${index}) > td:nth-child(1) > a`
			).text();
			const url =
        $(`table:nth-child(4) > tbody > tr:nth-child(${index}) > td:nth-child(1) > a`).attr(
        	'href'
        ) || '';
			const modified =
        $(`table:nth-child(4) > tbody > tr:nth-child(${index}) > td:nth-child(3)`).text() || 0;

			const updated = moment(modified, 'MM/DD/YYYY hh:mm:ss').unix();

			if (name.match(/shapefile/gi)) {
				results.push({
					url,
					updated,
					created: 0,
					description: '',
					name,
				});
			}
		}

		return results;
	});
};
