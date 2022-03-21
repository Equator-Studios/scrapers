import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
import puppeteer from 'puppeteer';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'BoulderCo', async () => {
    const results = [];
    const baseUrl = 'https://bouldercolorado.gov';
    const request = `${baseUrl}/search#?cludoquery=parcels&cludoCategory=Documents&cludopage=1&cludoinputtype=standard`;
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

    const links = $('a[data-cludo-result]');

    links.map((index, elem) => {
      const href = $(elem).attr('href');
      const hrefString = $(elem).text();
      const link = `${baseUrl}${href}`;
      if (hrefString.match(/parcel/gi)) {
        const description = $(elem).parent().siblings('p').text();
        const sanitizeDescriptionHtml = description
          .replace(/(<([^>]+)>|),/gi, '')
          .replace(/\r?\n|\r/g, '')
          .replace(/\r?\t|\r/g, '');
        results.push({
          url: link || '',
          updated: 0,
          created: 0,
          description: sanitizeDescriptionHtml || '',
          name: hrefString || '',
        });
      }
    });

    return results;
  });
};
