import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'OklahomaCityOk', async () => {
    const baseUrl =
      'https://oklahomacounty.geocortex.com/arcgis/rest/services/ParcelData/OklahomaCountyAllParcelsData4/MapServer';
    const layerNumber = 10;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
