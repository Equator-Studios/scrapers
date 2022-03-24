import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Sumter', async () => {
    const baseUrl =
      'http://svr4.sumtercountysc.org:6080/arcgis/rest/services/Parcel_Search/Parcel_Base/MapServer';
    const dataUrl = `${baseUrl}/0`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
