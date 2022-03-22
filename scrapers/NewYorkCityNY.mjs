import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'NewYorkCityNY', async () => {
    const results = [];
    const baseUrl = 'https://data.cityofnewyork.us';
    const request = await fetch(`${baseUrl}/api/views/smk3-tmxj`);
    const response = await request.json();

    const { blobId, createdAt, viewLastModified, description, name } = response;
    const url = `${baseUrl}/files/${blobId}`;

    let sanitizeDescriptionHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description
        .replace(/(<([^>]+)>)/gi, '')
        .replace(/\t+/gi, '')
        .replace(/\n+/gi, '')
        .replace(/\r+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    results.push({
      url,
      updated: viewLastModified,
      created: createdAt,
      description: sanitizeDescriptionHtml,
      name,
    });

    return results;
  });
};
