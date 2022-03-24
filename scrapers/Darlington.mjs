import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Darlington', async () => {
    const baseUrl =
      'https://services5.arcgis.com/8FJikaProY6O3ncx/ArcGIS/rest/services/PARCELS/FeatureServer';
    const dataUrl = `${baseUrl}/0`;

    const results = await mapserver({ baseUrl, dataUrl });

    return results;
  });
};
