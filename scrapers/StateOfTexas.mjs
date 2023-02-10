import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		// let id = '2679b514-bb7b-409f-97f3-ee3879f34448';
		const allcollections = await fetch(`${baseUrl}/collections_catalog`);
		const result = await allcollections.json();
		let collectionIds = result['results'];
		// console.log(result['results'].length);
		for(let i = 0;i<collectionIds.length;i++){
			// console.log(collectionIds[i]['collection_id']);
			let id = collectionIds[i]['collection_id'];
			let collections = `collections/${id}`;
			let resources = `resources?collection_id=${id}`;
			let collectionsRequest = await fetch(`${baseUrl}/${collections}`);
			let collection = await collectionsRequest.json();
			let resourcesRequest = await fetch(`${baseUrl}/${resources}`);
			let resource = await resourcesRequest.json();

			let { publication_date, description, name } = collection;
			let { results } = resource;
			let created = moment(publication_date, 'YYYY-MM-DD').unix();

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
