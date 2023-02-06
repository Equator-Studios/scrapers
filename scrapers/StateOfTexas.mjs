import fetch from 'node-fetch';
import moment from 'moment';

export default({database, DataScraper})=>{
	return DataScraper(database, 'StateOfTexas', async()=>{
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		const url = 'https://api.tnris.org/api/v1/collections_catalog/';
		return await fetch(url)
			.then(response => response.json())
			.then(json => json['results'].map(c => c['collection_id']))
			.then(async ids => {
				for (const id of ids) {
					let collections = `collections/${id}`;
					let resources = `resources?collection_id=${id}`;
					let collectionsRequest = await fetch(`${baseUrl}/${collections}`);
					let collection = await collectionsRequest.json();
					let resourcesRequest = await fetch(`${baseUrl}/${resources}`);
					let resource = await resourcesRequest.json();

					let {publication_date, description, name} = collection;
					let {results} = resource;
					let created = moment(publication_date, 'YYYY-MM-DD').unix();

					results.map(item => {
						if(!('detail'in item && item.detail === "Notfound")){
							return data.push({
								url: item.resource,
								updated: 0,
								created,
								description,
								name,
							});
						}
					})
				}
				return data;
			}).catch(error => console.error(error));
	});
};
