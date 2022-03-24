import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Columbia', async () => {
    const baseUrl =
      'https://mapsonline.columbiacountyga.gov/arcgis/rest/services/Map_LayersJS/MapServer';
    const layerNumber = 68;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
