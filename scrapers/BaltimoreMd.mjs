import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'BaltimoreMd', async () => {
    const id = '85767997c73d4b9292415f2661466273_0';

    const results = await dataset({ id });

    return results;
  });
};
