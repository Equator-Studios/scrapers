import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'MaricopaArizona', async () => {
    const results = [];
    const baseUrl = 'https://mcassessor.maricopa.gov';
    const request = await fetch(`${baseUrl}/mcs/?q=Parcels`);
    const response = await request.text();
    const $ = cheerio.load(response);

    const name = $(`.header-assessor-name`).text();
    const description = $(`#rpdetails .ribbon.ribbon-info h4`).text();
    const url =
      $(
        `#rpdetails > div > div.row.mx-0.py-3.mb-3.bg-gray-100.border.rounded > div.col-md-7 > div > a`
      ).attr('href') || '';

    let sanitizeDescriptionHtml = '';
    let sanitizeNameHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description
        .replace(/(<([^>]+)>)/gi, '')
        .replace(/\t+/gi, '')
        .replace(/\n+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    if (name) {
      sanitizeNameHtml = name
        .replace(/(<([^>]+)>)/gi, '')
        .replace(/\t+/gi, '')
        .replace(/\n+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    results.push({
      url: `${baseUrl}${url}`,
      updated: 0,
      created: 0,
      description: sanitizeDescriptionHtml,
      name: sanitizeNameHtml,
    });

    return results;
  });
};
