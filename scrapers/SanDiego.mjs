import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SanDiego', async () => {
    const id = 'c2a97c7a8f4b42d280f8113765d9b635_0';

    const results = await dataset({ id });

    return results;
  });
};
