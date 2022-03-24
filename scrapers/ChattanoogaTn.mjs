import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'ChattanoogaTn', async () => {
    const baseUrl = 'https://www.chattadata.org';

    const results = await browseportal({ baseUrl });

    return results;
  });
};
