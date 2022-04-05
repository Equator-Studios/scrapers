import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'ProvidenceRi', async () => {
		const baseUrl = 'https://data.providenceri.gov';
		const id = 'ynak-nf84';

		const results = await apiview({ baseUrl, id });

		return results;
	});
};
