import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'ClevelandOh', async () => {
    const baseUrl = 'https://data-cuyahoga.opendata.arcgis.com';

    const results = searchportal({ baseUrl });

    return results;
  });
};
