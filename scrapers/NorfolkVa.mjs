import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'NorfolkVa', async () => {
    const id = 'a516ce5d20b3431baae9ba99b256cb08_1';

    const results = await dataset({ id });

    return results;
  });
};
