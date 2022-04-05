import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'MiamiDadeCountyFl', async () => {
		const id = '347bce97227c4b54b04a3e626b558950_0';

		const results = await dataset({ id });

		return results;
	});
};
