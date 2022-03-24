import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Whitfield', async () => {
    const baseUrl =
      'https://gis.whitfieldcountyga.com/server/rest/services/Parcels_and_Development/MapServer';
    const dataUrl = `${baseUrl}/5`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
