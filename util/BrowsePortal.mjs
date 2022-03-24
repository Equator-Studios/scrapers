import fetch from 'node-fetch';
import cheerio from 'cheerio';

export const browseportal = async ({ baseUrl }) => {
  const results = [];
  const request = await fetch(`${baseUrl}/browse?q=parcels&sortBy=relevance&limit=1000`);
  const response = await request.text();
  const $ = cheerio.load(response);

  const links = $('.browse2-result-name-link');

  const urls = [];

  for (let index = 0; index < links.length; index++) {
    const elem = links[index];
    const text = $(elem).text();
    const href = $(elem).attr('href');

    if (text.match(/parcel/gi)) {
      const id = href.substring(href.lastIndexOf('/') + 1, href.length);
      urls.push(`${baseUrl}/api/views/${id}`);
    }
  }

  const fetchUrls = urls.map(request => fetch(request));
  const responses = await Promise.all(fetchUrls);

  const requests = responses.map(request => request.json());
  const dataset = await Promise.all(requests);

  for (let index = 0; index < dataset.length; index++) {
    const data = dataset[index];
    const { id, createdAt, viewLastModified, description, name, viewType } = data;
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
      url: url || '',
      updated: viewLastModified || 0,
      created: createdAt || 0,
      description: description || '',
      name: name || '',
    });
  }

  return results;
};

export default browseportal;
