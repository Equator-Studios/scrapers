import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'NewYorkCityNY', async () => {
		const baseUrl = 'https://data.cityofnewyork.us';
		const id = 'smk3-tmxj';

		const results = await apiview({ baseUrl, id });

		return results;
	});
};
