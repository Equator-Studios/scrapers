import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Horry', async () => {
    const baseUrl =
      'https://www.horrycounty.org/gisweb/rest/services/OpenData/Parcel_Geometry/MapServer';
    const dataUrl = `${baseUrl}/0`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
