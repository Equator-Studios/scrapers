import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'KansasCityMo', async () => {
    const results = [];
    const baseUrl = 'https://data.kcmo.org/api/views/vrys-qgrz';
    const request = await fetch(baseUrl);
    const response = await request.json();

    const { createdAt, viewLastModified, description, name } = response;
    const url = `${baseUrl}/rows.csv?accessType=DOWNLOAD`;

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
