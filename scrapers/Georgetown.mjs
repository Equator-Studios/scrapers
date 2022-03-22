import fetch from 'node-fetch';
import moment from 'moment';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Georgetown', async () => {
    const results = [];
    const baseUrl =
      'https://opendata.arcgis.com/api/v3/datasets/2d26a31d2e1541a4bfc68aac77f212a0_1';
    const request = await fetch(baseUrl);
    const response = await request.json();
    const requestDownload = await fetch(`${baseUrl}/downloads`);
    const responseDownload = await requestDownload.json();

    const {
      attributes: { description, created, snippet },
    } = response.data;

    let sanitizeDescriptionHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
    }

    const { data } = responseDownload;

    const [shapesfile] = data.filter(item => {
      const {
        attributes: { format },
      } = item;

      if (format === 'shp') {
        return item;
      }
    });

    const {
      attributes: { lastModified },
      links: { content },
    } = shapesfile;

    const updated = moment(lastModified, 'YYYY-MM-DDThh:mm:ss.SSSSZ').unix();

    results.push({
      url: content || '',
      updated: updated || 0,
      created: created || 0,
      description: sanitizeDescriptionHtml,
      name: snippet || '',
    });

    return results;
  });
};
