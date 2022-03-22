import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'OrangeCountyCa', async () => {
    const results = [];
    const baseUrl =
      'https://www.arcgis.com/sharing/rest/content/items/09b293e309e54cc793bd1b9f4c1f0e4e';
    const request = await fetch(`${baseUrl}/?f=json`);
    const response = await request.json();

    const { created, snippet, modified, name, url } = response;

    const description = response.description || '';

    let sanitizeDescriptionHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
    }

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
