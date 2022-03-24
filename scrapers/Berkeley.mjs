import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Berkeley', async () => {
    const baseUrl =
      'https://gis.berkeleycountysc.gov/arcgis/rest/services/desktop/internet_map/MapServer';
    const layerNumber = 3;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
