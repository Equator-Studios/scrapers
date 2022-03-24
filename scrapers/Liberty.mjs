import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Liberty', async () => {
    const baseUrl = 'https://gis.libertycountyga.com/arcgis/rest/services/Parcels/MapServer';
    const layerNumber = 0;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
