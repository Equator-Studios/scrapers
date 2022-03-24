import fetch from 'node-fetch';

export const mapserver = async payload => {
  const results = [];
  const { baseUrl, dataUrl } = payload;

  const request = await fetch(`${baseUrl}/info/itemInfo?f=json`);
  const response = await request.json();

  const { description, snippet, title } = response;

  const geoJson = `${dataUrl}/query?where=1=1&f=json`;

  let sanitizeDescriptionHtml = '';

  if (description) {
    sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
  }

  results.push({
    url: geoJson,
    updated: 0,
    created: 0,
    description: sanitizeDescriptionHtml,
    name: snippet || title,
  });

  return results;
};

export default mapserver;
