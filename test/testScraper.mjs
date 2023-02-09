import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		// Define the endpoint for the collections catalog
		const catalog = 'collections_catalog';
		// Make a fetch request to the collections catalog endpoint
		const collectionsCatalogRequest = await fetch(`${ baseUrl}/${catalog}`);
		// Convert the response to a JSON object
		const catalogResult = await collectionsCatalogRequest.json();
		// Extract the collection ids from the result
		let collectionIds = catalogResult['results'];

		// Loop through each collection id
		for (let i = 0; i < 10; i++) {
			// Get the current collection id
			let collectionId = collectionIds[i]['collection_id'];
			// Define the endpoint for the current collection
			let collections = `collections/${collectionId}`;
			// Define the endpoint for the resources associated with the current collection
			let resources = `resources?collection_id=${collectionId}`;
			// Make a fetch request to the collections endpoint
			let collectionsRequest = await fetch(`${baseUrl}/${collections}`);
			// Convert the response to a JSON object
			let collection = await collectionsRequest.json();
			// Make a fetch request to the resources endpoint
			let resourcesRequest = await fetch(`${baseUrl}/${resources}`);
			// Convert the response to a JSON object
			let resource = await resourcesRequest.json();

			// Destructure the collection JSON object to get the publication date, description, and name
			let { publication_date, description, name } = collection;
			// Destructure the resource JSON object to get the results
			let { results } = resource;
			// Convert the publication date to a Unix timestamp using moment
			let created = moment(publication_date, 'YYYY-MM-DD').unix();

			// Loop through each result
			results.map(item => {
				// Push an object with the resource URL, an updated value of 0, the created timestamp, the description, and the name to the data array
				return data.push({
					url: item.resource,
					updated: 0,
					created,
					description,
					name,
				});
			});
		}
		// Return the data array
		return data;
	});
};
