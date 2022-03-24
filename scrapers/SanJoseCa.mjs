import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SanJoseCa', async () => {
    const id = '4bb085cb99a64eff8e83d2bf92a8d5cb_270';

    const results = await dataset({ id });

    return results;
  });
};
