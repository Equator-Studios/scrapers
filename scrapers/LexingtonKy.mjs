import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'LexingtonKy', async () => {
		const id = 'e4a525d8772741468205e82fc173db22_0';

		const results = await dataset({ id });

		return results;
	});
};
