import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'ChattanoogaTn', async () => {
    const results = [];
    const baseUrl = 'https://www.chattadata.org';
    const request = await fetch(
      `${baseUrl}/browse?limitTo=datasets&q=parcels&sortBy=relevance&limit=1000`
    );
    const response = await request.text();
    const $ = cheerio.load(response);

    const links = $('.browse2-result-name-link');

    const urls = [];

    links.map((index, elem) => {
      const text = $(elem).text();
      const href = $(elem).attr('href');

      if (text.match(/parcel/gi)) {
        const id = href.substring(href.lastIndexOf('/') + 1, href.length);
        urls.push(`${baseUrl}/api/views/${id}`);
      }
    });

    const fetchUrls = urls.map(request => fetch(request));
    const responses = await Promise.all(fetchUrls);

    const requests = responses.map(request => request.json());
    const dataset = await Promise.all(requests);

    dataset.map(data => {
      const { id, createdAt, viewLastModified, description, name, viewType } = data;

      let sanitizeDescriptionHtml = '';

      if (description) {
        sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
      }

      let url = '';
      switch (viewType) {
        case 'geo':
          url = `${baseUrl}/api/geospatial/${id}?method=export&format=Shapefile`;
          break;
        case 'tabular':
          url = `${baseUrl}/api/views/${id}/rows.csv?accessType=DOWNLOAD`;
          break;
        default:
          break;
      }
      results.push({
        url,
        updated: viewLastModified || 0,
        created: createdAt || 0,
        description: sanitizeDescriptionHtml,
        name: name || '',
      });
    });

    return results;
  });
};
