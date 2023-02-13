import fetch from 'node-fetch';
import moment from 'moment';

const API = {
  baseUrl: 'https://api.tnris.org/api/v1',

  async getCollectionsCatalog(url) {
    return await (await fetch(url)).json();
  },
  async getCollection(collectionId) {
    const response = await fetch(`${this.baseUrl}/collections/${collectionId}`);
    if (!response.ok)
      return Promise.reject(
        `Server responded with status ${response.status} for collection ${collectionId}`
      );
    return response.json();
  },
  async getResources(collectionId) {
    let nextUrl = `${this.baseUrl}/resources?collection_id=${collectionId}`;
    let results = [];

    while (nextUrl !== null) {
      const resources = await (await fetch(nextUrl)).json();
      results.push(...resources.results);
      nextUrl = resources.next;
    }
    return results;
  },
};

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'StateOfTexas', async () => {
    const data = [];

    //limit to 100 results per request to avoid overloading server
    let nextCatalogUrl = `${API.baseUrl}/collections_catalog?limit=100`;

    while (nextCatalogUrl !== null) {
      console.log('scraping datasets for endpoint:', nextCatalogUrl);
      const { results: catalogResults, next } = await API.getCollectionsCatalog(nextCatalogUrl);

      // create array of promises that resolve concurrently without waiting for each other
      const promises = catalogResults.map(result => {
        return Promise.all([
          API.getCollection(result.collection_id),
          API.getResources(result.collection_id),
        ]).then(([collection, resources]) => {
          for (let item of resources) {
            data.push({
              url: item.resource,
              updated: 0,
              created: moment(collection.publication_date, 'YYYY-MM-DD').unix(),
              description: collection.description,
              name: collection.name,
            });
          }
        });
      });

      await Promise.allSettled(promises);

      nextCatalogUrl = next;
    }

    return data;
  });
};
