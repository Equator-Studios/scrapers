import fetch from 'node-fetch';
import moment from 'moment';

const baseUrl = 'https://api.tnris.org/api/v1';
let collectionIds = null;

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'StateOfTexas', async () => {
   
    // Initializing idArray if it has not been initialized yet
    if (!collectionIds) {
      
      // Fetching collection_id data from the API and mapping the results to an array
      const idData = await (await fetch('https://api.tnris.org/api/v1/collections_catalog/')).json();
      collectionIds = idData.results.map(function(item) { return item["collection_id"]; });
    }

    const data=[];

    // Looping over each collection_id
    for (const id of collectionIds) {
      // Building the URLs for the collections and resources endpoints
      var collections = `collections/${id}`;
      var resources = `resources?collection_id=${id}`;
      
      // Fetching the collections and resources data simultaneously/parallely instead of sequentially
      const [collectionsResponse, resourcesResponse] = await Promise.all([
        fetch(`${baseUrl}/${collections}`),
        fetch(`${baseUrl}/${resources}`),
      ]);
      
      // Parsing the response data from JSON to objects
      const [collectionsData, resourcesData] = await Promise.all([collectionsResponse.json(), resourcesResponse.json()]);

      // extracting the data from objects
      const { publication_date, description, name } = collectionsData;
      const { results } = resourcesData;

      // Converting the publication_date to Unix time
      const created = moment(publication_date, 'YYYY-MM-DD').unix();

      // Adding results with content to the data array
      
      data.push(...results.map(item => ({
        url: item.resource,
        updated: 0,
        created,
        description,
        name,
      })));
    }

    // Return the final data array
    return data;
  });
};