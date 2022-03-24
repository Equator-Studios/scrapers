import { sharing } from '../util/Sharing.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'JohnsCreekGa', async () => {
    const id = 'ccf7aa525143406da6e36f79e989b263';

    const results = await sharing({ id });

    return results;
  });
};
