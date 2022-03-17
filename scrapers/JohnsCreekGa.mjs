import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'JohnsCreekGa', async () => {
    const results = [];
    const baseUrl =
      'https://www.arcgis.com/sharing/rest/content/items/ccf7aa525143406da6e36f79e989b263';
    const request = await fetch(`${baseUrl}/?f=json`);
    const response = await request.json();

    const { created, snippet, modified, name } = response;

    const description = response.description || '';

    const sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');

    const url = `${baseUrl}/data`;

    results.push({
      url,
      updated: modified,
      created,
      description: sanitizeDescriptionHtml,
      name: snippet || name,
    });

    return results;
  });
};
