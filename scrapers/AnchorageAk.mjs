import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'AnchorageAk', async () => {
    const baseUrl = 'https://data.muni.org';

    const results = await browseportal({ baseUrl });

    return results;
  });
};
