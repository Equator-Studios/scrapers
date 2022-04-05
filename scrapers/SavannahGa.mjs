import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'SavannahGa', async () => {
		const baseUrl = 'https://data-sagis.opendata.arcgis.com';

		const results = searchportal({ baseUrl });

		return results;
	});
};
