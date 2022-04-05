import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'WashingtonDc', async () => {
		const baseUrl = 'https://opendata.dc.gov';

		const results = searchportal({ baseUrl });

		return results;
	});
};
