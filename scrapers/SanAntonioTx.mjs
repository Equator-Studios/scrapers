import { sharing } from '../util/Sharing.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'SanAntonioTx', async () => {
		const id = '41dbc36ff1ab4554b54b5f0bb138bf73';

		const results = await sharing({ id });

		return results;
	});
};
