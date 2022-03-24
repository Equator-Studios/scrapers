import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Saluda', async () => {
    const baseUrl =
      'https://saludacountysc.net/arcgis/rest/services/ParcelViewers/PublicWebsite/MapServer';
    const layerNumber = 4;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
