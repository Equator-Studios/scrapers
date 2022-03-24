import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'AtlantaGa', async () => {
    const id = '8cae9e82135d4bd0925f8c5e71254924_0';

    const results = await dataset({ id });

    return results;
  });
};
