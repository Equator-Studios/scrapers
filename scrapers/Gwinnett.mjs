import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Gwinnett', async () => {
    const baseUrl =
      'https://gis3.gwinnettcounty.com/mapvis/rest/services/OnPoint/GC_Parcel/MapServer';
    const dataUrl = `${baseUrl}/9`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
