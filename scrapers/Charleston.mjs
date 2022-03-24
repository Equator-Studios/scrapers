import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Charleston', async () => {
    const baseUrl =
      'https://gisccapps.charlestoncounty.org/arcgis/rest/services/GIS_VIEWER/Public_Search/MapServer';
    const layerNumber = 4;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
