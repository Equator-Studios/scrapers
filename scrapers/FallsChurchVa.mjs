import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'FallsChurchVa', async () => {
		const baseUrl = 'https://opendata-fallschurch.opendata.arcgis.com';

		const results = searchportal({ baseUrl });

		return results;
	});
};
