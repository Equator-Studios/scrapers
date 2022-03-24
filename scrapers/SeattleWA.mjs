import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SeattleWA', async () => {
    const baseUrl = 'https://data.seattle.gov';
    const id = 'r37k-i652';

    const results = await apiview({ baseUrl, id });

    return results;
  });
};
