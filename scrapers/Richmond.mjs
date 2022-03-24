import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Richmond', async () => {
    const baseUrl = 'https://gismap.augustaga.gov/arcgis/rest/services/Map_LayersJS/MapServer';
    const dataUrl = `${baseUrl}/316`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
