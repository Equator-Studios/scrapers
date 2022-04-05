import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'RaleighNc', async () => {
		const id = '29b5ee8f17694f3d9f0bbfd9ba1945f8_0';

		const results = await dataset({ id });

		return results;
	});
};
