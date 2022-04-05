import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Georgetown', async () => {
		const id = '2d26a31d2e1541a4bfc68aac77f212a0_1';

		const results = await dataset({ id });

		return results;
	});
};
