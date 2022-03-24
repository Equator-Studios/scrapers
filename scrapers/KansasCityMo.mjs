import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'KansasCityMo', async () => {
    const baseUrl = 'https://data.kcmo.org';
    const id = 'vrys-qgrz';

    const results = await apiview({ baseUrl, id });

    return results;
  });
};
