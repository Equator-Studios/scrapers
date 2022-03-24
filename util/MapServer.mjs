import fetch from 'node-fetch';

export const mapserver = async ({ baseUrl, layerNumber }) => {
  const results = [];
  const request = await fetch(`${baseUrl}/info/itemInfo?f=json`);
  const response = await request.json();

  const { description, snippet, title } = response;

  const geoJson = `${baseUrl}/${layerNumber}/query?where=1=1&f=json`;

  results.push({
    url: geoJson,
    updated: 0,
    created: 0,
    description: description || '',
    name: snippet || title || '',
  });

  return results;
};

export default mapserver;
