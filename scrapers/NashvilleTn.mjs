import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'NashvilleTn', async () => {
    const baseUrl = 'https://maps.nashville.gov/arcgis/rest/services/Cadastral/Parcels/MapServer';
    const dataUrl = `${baseUrl}/0`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
