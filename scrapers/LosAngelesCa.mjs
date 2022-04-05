import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'LosAngelesCa', async () => {
		const baseUrl = 'https://data.lacity.org';

		const results = await browseportal({ baseUrl });

		return results;
	});
};
