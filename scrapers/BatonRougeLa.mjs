import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'BatonRougeLa', async () => {
		const baseUrl = 'https://data.brla.gov';
		const id = 're5c-hrw9';

		const results = await apiview({ baseUrl, id });

		return results;
	});
};
