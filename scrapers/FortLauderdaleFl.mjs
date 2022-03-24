import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'FortLauderdaleFl', async () => {
    const baseUrl = 'https://gis.fortlauderdale.gov/server/rest/services/TaxParcel/MapServer';
    const layerNumber = 0;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
