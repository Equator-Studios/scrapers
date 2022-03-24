import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Lexington', async () => {
    const baseUrl = 'https://maps.lex-co.com/agstserver/rest/services/Property/MapServer';
    const layerNumber = 4;

    const results = await mapserver({ baseUrl, layerNumber });

    return results;
  });
};
