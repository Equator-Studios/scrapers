import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {

		// Definitions
		const data=[]
		const baseUrl = 'https://api.tnris.org/api/v1';

		// Getting collection ID data
		const id_data = await fetch('https://api.tnris.org/api/v1/collections_catalog/')
							  .then(response => response.json())
		const idArray = id_data.results.map(function(item) { return item["collection_id"]; });
		// Looping over each collection_id
		for (const id of idArray) {
			var collections = `collections/${id}`
			var resources = `resources?collection_id=${id}`
			var collectionsRequest = await fetch(`${baseUrl}/${collections}`)
			var collection = await collectionsRequest.json()
			var resourcesRequest = await fetch(`${baseUrl}/${resources}`)
			var resource = await resourcesRequest.json()

			var { publication_date, description, name } = collection;
			var { results } = resource;
			var created = moment(publication_date, 'YYYY-MM-DD').unix();
			
			// Only adding results with content to the data array
			if( results.length>0){

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
		}
		return data;
	});
};
