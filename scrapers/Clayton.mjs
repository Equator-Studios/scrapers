import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Clayton', async () => {
    const baseUrl =
      'https://weba.co.clayton.ga.us:5443/server/rest/services/PlanningZoning/ZoningData/MapServer';
    const layerNumber = 5;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
