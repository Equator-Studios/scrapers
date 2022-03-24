import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
import puppeteer from 'puppeteer';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'StLouisMo', async () => {
    const results = [];
    const baseUrl = 'https://www.stlouis-mo.gov/data/datasets/dataset.cfm?id=82';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    const html = await page.evaluate(() => {
      return {
        markup: document.documentElement.innerHTML,
      };
    });

    await browser.close();

    const $ = cheerio.load(html.markup);

    const links = $('.js-data-distribution-direct');

    for (let index = 0; index < links.length; index++) {
      const elem = links[index];
      const title = $(elem).parent().siblings('a').text().trim();
      const href = $(elem).attr('href');
      const hrefString = $(elem).text();
      const description = $(elem)
        .parent()
        .parent()
        .siblings('.list-group-description')
        .text()
        .trim();
      const updatedString = $(elem)
        .parent()
        .parent()
        .siblings('.list-group-footer.list-group-tags')
        .text()
        .trim();
      const updatedParts = updatedString.split(':');
      const updatedDate = updatedParts[updatedParts.length - 1];
      const updated = moment(updatedDate, 'MM/DD/YY').unix();

      if (hrefString.match(/shapefile/gi)) {
        results.push({
          url: href || '',
          updated: updated || 0,
          created: 0,
          description: description || '',
          name: title || '',
        });
      }
    }

    return results;
  });
};
