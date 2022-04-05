import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'KingCountyWashington', async () => {
		const baseUrl = 'https://data.kingcounty.gov';
		const id = '5idm-g74e';

		const results = await apiview({ baseUrl, id });

		return results;
	});
};
