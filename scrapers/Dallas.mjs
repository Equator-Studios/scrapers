import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Dallas', async () => {
		const baseUrl = 'https://www.dallasopendata.com';

		const results = await browseportal({ baseUrl });

		return results;
	});
};
