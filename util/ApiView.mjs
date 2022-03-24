import fetch from 'node-fetch';

export const apiview = async ({ baseUrl, id }) => {
  const results = [];
  const request = await fetch(`${baseUrl}/api/views/${id}`);
  const response = await request.json();
  let url;

  const {
    blobId,
    createdAt,
    viewLastModified,
    description,
    name,
    viewType,
    metadata: { additionalAccessPoints },
  } = response;

  switch (viewType) {
    case 'geo':
      url = `${baseUrl}/api/geospatial/${id}?method=export&format=Shapefile`;
      break;
    case 'tabular':
      url = `${baseUrl}/api/views/${id}/rows.csv?accessType=DOWNLOAD`;
      break;
    case 'blobby':
      url = `${baseUrl}/api/views/${id}/files/${blobId}`;
      break;
    case 'href':
      const [shapefile] = additionalAccessPoints.filter(item => item.title === 'Shapefile');
      url = shapefile.urls['application/zip'];
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

  return results;
};

export default apiview;
