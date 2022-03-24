import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SanFranciscoCa', async () => {
    const baseUrl = 'https://data.sfgov.org';

    const results = await browseportal({ baseUrl });

    return results;
  });
};
