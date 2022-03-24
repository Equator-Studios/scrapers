import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'ArlingtonVa', async () => {
    const id = 'b70198178ff44462b00c5b5c0012668d_0';

    const results = await dataset({ id });

    return results;
  });
};
