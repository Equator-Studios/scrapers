import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'DurhamNc', async () => {
		const baseUrl = 'https://live-durhamnc.opendata.arcgis.com';

		const results = searchportal({ baseUrl });

		return results;
	});
};
