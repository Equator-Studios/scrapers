import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'RiversideCa', async () => {
		const id = 'd53885b540f0444196356290a13a779d_0';

		const results = await dataset({ id });

		return results;
	});
};
