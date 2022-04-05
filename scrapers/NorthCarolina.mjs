import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'NorthCarolina', async () => {
		const baseUrl = 'https://www.nconemap.gov';

		const results = searchportal({ baseUrl });

		return results;
	});
};
