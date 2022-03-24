import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SantaMonicaCa', async () => {
    const baseUrl = 'https://data.smgov.net';
    const id = 'sa4y-7yah';

    const results = await apiview({ baseUrl, id });

    return results;
  });
};
