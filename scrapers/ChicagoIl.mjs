import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'ChicagoIl', async () => {
		const baseUrl = 'https://datacatalog.cookcountyil.gov';

		const results = await browseportal({ baseUrl });

		return results;
	});
};
