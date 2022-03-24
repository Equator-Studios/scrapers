import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'CincinnatiOh', async () => {
    const id = '101b808f4c134959aa0263667aef7953_0';

    const results = await dataset({ id });

    return results;
  });
};
