import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'StateOfTexas', async () => {
		const data = [];
        const baseUrl = 'https://api.tnris.org/api/v1';

        const response = await fetch(`https://api.tnris.org/api/v1/collections_catalog/`);
        //Check if API response status is 200
        if(response.status !== 200) 
            throw new Error('Error while fetching collection ids');

        const collectionData =  await response.json();
        //Getting Collection IDs
        const collectionIds = collectionData.results.map(collection => collection['collection_id']);

        //Loop through all the collection ids
        for(const id of collectionIds) {
            const collections = `collections/${id}`;
            const resources = `resources?collection_id=${id}`;
            const collectionsRequest = await fetch(`${baseUrl}/${collections}`);
            const collection = await collectionsRequest.json();
            const resourcesRequest = await fetch(`${baseUrl}/${resources}`);
		    const resource = await resourcesRequest.json();

            const { publication_date, description, name } = collection;
            const { results } = resource;
            const created = moment(publication_date, 'YYYY-MM-DD').unix();

            //Checking if results have some data or it's empty
            if(results.length !== 0) {
                //Loop through the results array and push each resource in data array
                results.map(singleResource => data.push({
                        url: singleResource.resource,
                        updated: 0,
                        name,
                        created,
                        description
                    })
                )
            }
        }

		return data;
	});
};
