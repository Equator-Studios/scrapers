import fetch from 'node-fetch';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SeattleWA', async () => {
    const results = [];
    const baseUrl = 'https://data.seattle.gov';
    const request = await fetch(`${baseUrl}/api/views/r37k-i652`);
    const response = await request.json();

    const {
      createdAt,
      viewLastModified,
      description,
      name,
      metadata: { additionalAccessPoints },
    } = response;
    const [shapefile] = additionalAccessPoints.filter(item => item.title === 'Shapefile');
    const { urls } = shapefile;
    const url = urls['application/zip'];

    let sanitizeDescriptionHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
    }

    results.push({
      url,
      updated: viewLastModified,
      created: createdAt,
      description: sanitizeDescriptionHtml,
      name,
    });

    return results;

    return results;
  });
};
