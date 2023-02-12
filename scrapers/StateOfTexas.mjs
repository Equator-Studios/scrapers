import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';

		//Lets scrape the collection ID data as suggested on discord

		const data_id = await fetch('https://api.tnris.org/api/v1/collections_catalog/')
		.then(res => res.json())

		const id_array = data_id.results.map(i => i["collection_id"])

		//Now lets loop over the collection IDs

		for (const id of id_array) {
      		const collections = `collections/${id}`;
      		const resources = `resources?collection_id=${id}`;
      		const collectionsRequest = await fetch(`${baseUrl}/${collections}`);
      		const collection = await collectionsRequest.json();
      		const resourcesRequest = await fetch(`${baseUrl}/${resources}`);
      		const resource = await resourcesRequest.json();
			const { publication_date, description, name } = collection;
      		const { results } = resource;
      		const created = moment(publication_date, 'YYYY-MM-DD').unix();

			  
			  // Lets only add the results with content to the array
			  
			  if(results.length > 0) {
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

