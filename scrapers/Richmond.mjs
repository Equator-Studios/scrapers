import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Richmond', async () => {
    const baseUrl = 'https://gismap.augustaga.gov/arcgis/rest/services/Map_LayersJS/MapServer';
    const layerNumber = 316;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
