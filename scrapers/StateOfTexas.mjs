import fetch from 'node-fetch';
import moment from 'moment';

async function getIds(url){
	const response = await fetch(url);
	const json = await response.json();
	return json.results.map(c => c['collection_id']);
}

export default({database, DataScraper})=>{
	return DataScraper(database, 'StateOfTexas', async()=>{
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';
		const url = 'https://api.tnris.org/api/v1/collections_catalog/';
		const ids = await getIds(url);

		for(let id of ids){
			let collections = `collections/${id}`;
			let resources = `resources?collection_id=${id}`;
			let collectionsRequest = await fetch(`${baseUrl}/${collections}`);
			let collection = await collectionsRequest.json();
			let resourcesRequest = await fetch(`${baseUrl}/${resources}`);
			let resource = await resourcesRequest.json();

			let {publication_date,description,name} = collection;
			let {results} = resource;
			let created = moment(publication_date,'YYYY-MM-DD').unix();

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
			});
		}
		return data;
	});
};
