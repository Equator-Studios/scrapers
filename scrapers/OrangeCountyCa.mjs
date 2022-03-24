import { sharing } from '../util/Sharing.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'OrangeCountyCa', async () => {
    const id = '09b293e309e54cc793bd1b9f4c1f0e4e';

    const results = await sharing({ id });

    return results;
  });
};
