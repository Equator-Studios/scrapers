import fetch from 'node-fetch';
import moment from 'moment';

//Function takes 2 parameters, collection and resource data and return an array
const getCollectionsAndResourceData = (collection, resource) => {
    //Destructuring collections and resources
    const { publication_date, description, name } = collection;
    const { results } = resource;
    const created = moment(publication_date, 'YYYY-MM-DD').unix();

    //Loop through the results array and return required information
    return results.map(singleResource => ({
        url: singleResource.resource,
        updated: 0,
        name,
        created,
        description
    }));
}

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
        //Initialize an empty array to store result
		const data = [];
		const baseUrl = 'https://api.tnris.org/api/v1';

		//Fetch collection Ids
		let collectionIds;
		try {
		    const response = await fetch(`https://api.tnris.org/api/v1/collections_catalog/`);

		    //Check if API response status is 200
		    if(response.status !== 200) 
			throw new Error('Error while fetching collection ids');

		    collectionIds =  (await response.json()).results.map(collection => collection['collection_id']);
		} catch(error) {
		    console.error(error);
		    return data;
		}

		//Loop through all the collection ids
		for(const id of collectionIds) {
		    const collections = `collections/${id}`;
		    const resources = `resources?collection_id=${id}`;

		    let collectionResponse, resourceResponse, collectionResponseJson, resourceResponseJson;

		    //Fetch responnse from collections and resources
		    try {
			[collectionResponse, resourceResponse] = await Promise.all([
			    fetch(`${baseUrl}/${collections}`),
			    fetch(`${baseUrl}/${resources}`)
			]);

			[collectionResponseJson, resourceResponseJson] = await Promise.all([
			    collectionResponse.json(),
			    resourceResponse.json()
			])
		    } catch(err) {
			console.log(err);
			continue;
		    }

		    //Get the result from function and push into data array
		    data.push(...getCollectionsAndResourceData(
			collectionResponseJson,
			resourceResponseJson
		    ))
        	}
        
		return data;
	});
};


