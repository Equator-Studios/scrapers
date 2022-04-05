import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'LasVegasNv', async () => {
		const id = '1a89b7b4de56414088c854c4f785e3e7_0';

		const results = await dataset({ id });

		return results;
	});
};
