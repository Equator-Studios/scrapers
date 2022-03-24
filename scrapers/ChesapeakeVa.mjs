import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'ChesapeakeVa', async () => {
    const id = 'a09b19515cdd4ce4b07e0bc3406ff0b9_10';

    const results = await dataset({ id });

    return results;
  });
};
