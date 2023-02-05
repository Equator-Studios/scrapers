import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'StateOfTexas', async () => {
    const data = [];
    const baseUrl = 'https://api.tnris.org/api/v1';

    // Gathering Collection ID's (c_id):
    const c_id_url = 'https://api.tnris.org/api/v1/collections_catalog/';
	const c_id_response = await fetch(c_id_url);
	if (!c_id_response.ok) {
	throw new Error(`Error fetching collection id data: ${c_id_response.statusText}`);
	}
	const c_id_json = await c_id_response.json();
	const c_id_array = c_id_json.results.map(i => i["collection_id"]);
	
	// Looping through collection ids:
	let test_counter = 0
	for (let c_id of c_id_array) {
		let collections = `collections/${c_id}`;
		let resources = `resources?collection_id=${c_id}`;
		let collectionsRequest = await fetch(`${baseUrl}/${collections}`);
		let collection = await collectionsRequest.json();
		let resourcesRequest = await fetch(`${baseUrl}/${resources}`);
		let resource = await resourcesRequest.json();

		let { publication_date, description, name, tags,  } = collection;
		let { results } = resource;
		let created = moment(publication_date, 'YYYY-MM-DD').unix();

		results.map(item => {
			// Add only existing data to `data` array:
			if (!('detail' in item)) {
			let array = {
				url: item.resource,
				updated: 0,
				created,
				description,
				name,
				tags
			};
			return data.push(array);
			};
		});
	};
    return data;
  });
};