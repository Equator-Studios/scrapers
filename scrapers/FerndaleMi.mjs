import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'FerndaleMi', async () => {
		const id = 'ebc18573de2d4721b51a0fb9e3b68635_0';

		const results = await dataset({ id });

		return results;
	});
};
