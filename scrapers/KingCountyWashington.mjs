import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'KingCountyWashington', async () => {
    const results = [];
    const baseUrl = 'https://data.kingcounty.gov';
    const request = await fetch(`${baseUrl}/api/views/5idm-g74e`);
    const response = await request.json();

    const {
      createdAt,
      viewLastModified,
      description,
      name,
      metadata: {
        geo: { owsUrl },
      },
    } = response;
    const url = `${baseUrl}${owsUrl}?method=export&format=Shapefile`;

    results.push({
      url,
      updated: viewLastModified,
      created: createdAt,
      description,
      name,
    });

    return results;
  });
};
