import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'CharlotteNc', async () => {
    const id = 'b919780fc011446389c560fb91315595_3';

    const results = await dataset({ id });

    return results;
  });
};
