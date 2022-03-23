import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
import puppeteer from 'puppeteer';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'DurhamNc', async () => {
    const results = [];
    const arcgisUrl = 'https://opendata.arcgis.com/api/v3/datasets';
    const baseUrl = 'https://live-durhamnc.opendata.arcgis.com';
    const request = `${baseUrl}/search?collection=Dataset&q=parcels&type=feature%20layer`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(request, { waitUntil: 'networkidle0' });

    const html = await page.evaluate(() => {
      return {
        markup: document.documentElement.innerHTML,
      };
    });

    await browser.close();

    const $ = cheerio.load(html.markup);

    const links = $('.result-name');

    const urls = [];

    links.map((index, elem) => {
      const href = $(elem).attr('href');
      const hrefString = $(elem).text();
      const link = `${baseUrl}${href}`;
      if (hrefString.match(/parcel/gi)) {
        urls.push(link);
      }
    });

    const fetchUrls = urls.map(request => fetch(request));
    const responses = await Promise.all(fetchUrls);

    const requests = responses.map(request => request.text());
    const dataset = await Promise.all(requests);

    const arcgisIds = [];
    const arcgisUrls = [];

    dataset.map(html => {
      const $ = cheerio.load(html);
      const content = $('meta[name="twitter:image"]').attr('content');
      const [parts] = content.split('/info');
      const [base, id] = parts.split('items/');
      arcgisIds.push(`${arcgisUrl}/${id}`);
      arcgisUrls.push(`${arcgisUrl}/${id}/downloads`);
    });

    const fetchArcgisUrls = arcgisUrls.map(request => fetch(request));
    const responsesArcgisUrls = await Promise.all(fetchArcgisUrls);

    const requestsArcgisUrls = responsesArcgisUrls.map(request => request.json());
    const datasetArcgisUrl = await Promise.all(requestsArcgisUrls);

    datasetArcgisUrl.map(item => {
      const { data } = item;
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
        updated,
        created: 0,
        description: '',
        name: '',
      });
    });

    const fetchArcgisIds = arcgisIds.map(request => fetch(request));
    const responsesArcgisIds = await Promise.all(fetchArcgisIds);

    const requestsArcgisIds = responsesArcgisIds.map(request => request.json());
    const datasetArcgisIds = await Promise.all(requestsArcgisIds);

    datasetArcgisIds.map((item, index) => {
      const {
        data: {
          attributes: { description, created, snippet, name },
        },
      } = item;

      let sanitizeDescriptionHtml = '';

      if (description) {
        sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
      }

      results[index].description = sanitizeDescriptionHtml;
      results[index].created = created;
      results[index].name = snippet || name;
    });

    return results;
  });
};
