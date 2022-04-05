import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'DetroitMi', async () => {
		const id = '9ca25373d4f747be85850344186dda3c_0';

		const results = await dataset({ id });

		return results;
	});
};
