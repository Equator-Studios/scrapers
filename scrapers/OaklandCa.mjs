import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'OaklandCa', async () => {
		const baseUrl = 'https://data.oaklandca.gov';

		const results = await browseportal({ baseUrl });

		return results;
	});
};
