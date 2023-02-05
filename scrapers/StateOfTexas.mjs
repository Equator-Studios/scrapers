import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		const collections = 'collections';
		const collectionsRequest = await fetch(`${baseUrl}/${collections}`);
		const collectionsData = await collectionsRequest.json();
		const { results } = collectionsData;

		const promises = results.map(async collection => {
			const { publication_date, description, name, id } = collection;
			const resources = `resources?collection_id=${id}`;
			const resourcesRequest = await fetch(`${baseUrl}/${resources}`);
			const resourcesData = await resourcesRequest.json();
			const { results: resourceResults } = resourcesData;
			const created = moment(publication_date, 'YYYY-MM-DD').unix();

			const collectionData = resourceResults.map(item => {
				return {
					url: item.resource,
					updated: 0,
					created,
					description,
					name,
				};
			});
			data.push(...collectionData);
		});

		await Promise.all(promises);

		return data;
	});
};