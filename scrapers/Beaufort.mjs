import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Beaufort', async () => {
    const baseUrl =
      'https://gis.beaufortcountysc.gov/server/rest/services/ParcelsWithAssessorData/MapServer';
    const dataUrl = `${baseUrl}/0`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
