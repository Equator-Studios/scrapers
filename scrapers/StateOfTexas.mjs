import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		const IdsRequest = await fetch(`${baseUrl}/collections_catalog/`);
		const IdsJson = await IdsRequest.json();
		const Ids = IdsJson.results.map(id => id.collection_id);

		for(let i = 0; i < Ids.length ; i++) /*The classic for loop does not requires a big polyfill*/ {
			

		const collections = `collections/${Ids[i]}`;
		const resources = `resources?collection_id=${Ids[i]}`;

		const [collectionsRequest, resourcesRequest] = await Promise.all([fetch(`${baseUrl}/${collections}`), fetch(`${baseUrl}/${resources}`)]);

		const [collection, resource] = await Promise.all([collectionsRequest.json(), resourcesRequest.json()]);
			
		const { publication_date, description, name } = collection;
		const { results } = resource;
		const created = moment(publication_date, 'YYYY-MM-DD').unix();

		results.map(item => {
			return data.push({
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
