import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		const catalouge = await fetch(`${baseUrl}/collections_catalog/`);
		const catalougeData = await catalouge.json();
		const datasets = catalougeData.results.map(dataset => dataset.collection_id);
		for (let i = 0 ; i < datasets.length; i++){ //forEach loops dont work with async
			const id = datasets[i];
			const collections = `collections/${id}`;
			const resources = `resources?collection_id=${id}`;
			const collectionsRequest = await fetch(`${baseUrl}/${collections}`);
			const collection = await collectionsRequest.json();
			const resourcesRequest = await fetch(`${baseUrl}/${resources}`);
			const resource = await resourcesRequest.json();

			const { publication_date, description, name } = collection;
			const { results } = resource;
			const created = moment(publication_date, 'YYYY-MM-DD').unix();

			results.forEach(item => {
				data.push({
					url: item.resource,
					updated: 0,
					created,
					description,
					name,
				});
			});
		}
		return data;
	});
};
