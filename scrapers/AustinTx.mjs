import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'AustinTx', async () => {
    const results = [];
    const baseUrl = 'https://data.austintexas.gov';
    const request = await fetch(`${baseUrl}/api/views/f5rm-df6x`);
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
