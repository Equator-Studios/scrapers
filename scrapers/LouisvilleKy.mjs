import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'LouisvilleKy', async () => {
    const id = '47085b87ac754d60942ea324a3b0f54f_1';

    const results = await dataset({ id });

    return results;
  });
};
