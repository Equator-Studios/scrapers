import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Paulding', async () => {
    const baseUrl = 'https://arcgis5.roktech.net/arcgis/rest/services/Paulding/GoMaps4/MapServer';
    const dataUrl = `${baseUrl}/36`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
