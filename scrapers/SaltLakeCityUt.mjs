import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SaltLakeCityUt', async () => {
    const baseUrl = 'https://opendata.gis.utah.gov';

    const results = searchportal({ baseUrl });

    return results;
  });
};
