import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Anderson', async () => {
    const baseUrl =
      'https://propertyviewer.andersoncountysc.org/arcgis/rest/services/Parcel_Sales/MapServer';
    const dataUrl = `${baseUrl}/0`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
