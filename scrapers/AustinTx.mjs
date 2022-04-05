import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'AustinTx', async () => {
		const baseUrl = 'https://data.austintexas.gov';
		const id = 'f5rm-df6x';

		const results = await apiview({ baseUrl, id });

		return results;
	});
};
