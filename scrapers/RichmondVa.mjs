import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'RichmondVa', async () => {
    const baseUrl = 'https://data.richmondgov.com';
    const id = 'b52i-7ygb';

    const results = await apiview({ baseUrl, id });

    return results;
  });
};
