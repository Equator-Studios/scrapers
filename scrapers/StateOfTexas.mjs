import fetch from 'node-fetch';
import moment from 'moment';

//Function takes 2 parameters, base url and id and return data extracted through collections and resources of single id
const getCollectionsAndResourceData = async (baseUrl, id) => {
    const collections = `collections/${id}`;
    const resources = `resources?collection_id=${id}`;

    let collectionResponse, resourceResponse;

    //Fetch responnse from collections and resources
    try {
        [collectionResponse, resourceResponse] = await Promise.all([
            fetch(`${baseUrl}/${collections}`).then(res => res.json()),
            fetch(`${baseUrl}/${resources}`).then(res => res.json()),
        ]);
    } catch (err) {
        console.error(err);
        return [];
    }

    //Destructuring collections and resources
    const { publication_date, description, name } = collectionResponse;
    const { results } = resourceResponse;
    const created = moment(publication_date, 'YYYY-MM-DD').unix();

    //Loop through the results array and return required information
    return results.map(singleResource => ({
        url: singleResource.resource,
        updated: 0,
        name,
        created,
        description,
    }));
};

export default ({ database, DataScraper }) => {
    return DataScraper(database, 'StateOfTexas', async () => {
        const baseUrl = 'https://api.tnris.org/api/v1';

        //Initialize an empty array to store result
        const data = [];

        //Fetch collection Ids
        try {
            const response = await fetch(`${baseUrl}/collections_catalog/`);

            //Check if API response status is 200
            if (response.status !== 200) throw new Error('Error while fetching collection ids');

            const collectionIds = (await response.json()).results.map(collection => collection['collection_id']);

            //Loop through all the collection ids
            for (const id of collectionIds) {
                //Get the result from function and push into data array
                data.push(...(await getCollectionsAndResourceData(baseUrl, id)));
            }
        } catch (error) {
            console.error(error);
            return data;
        }

        //Return the data retrieved through extraction of collections and resources of all id's
        return data;
    });
};
