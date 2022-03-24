import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'NewOrleansLa', async () => {
    const id = '273cc01f8dae4765b2924ba5de028c27_0';

    const results = await dataset({ id });

    return results;
  });
};
