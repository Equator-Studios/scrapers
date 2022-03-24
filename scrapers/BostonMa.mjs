import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'BostonMa', async () => {
    const baseUrl = 'https://bostonopendata-boston.opendata.arcgis.com';

    const results = searchportal({ baseUrl });

    return results;
  });
};
