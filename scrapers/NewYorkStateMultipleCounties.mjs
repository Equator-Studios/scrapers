import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
import puppeteer from 'puppeteer';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'NewYorkStateMultipleCounties', async () => {
    const results = [];
    const baseUrl = 'http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1300';
    const request = baseUrl;
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

    const tableRow = $('#DatasetFilesListing > tbody > tr');

    for (let index = 0; index < tableRow.length; index++) {
      const name = $(`#DatasetFilesListing > tbody > tr:nth-child(${index}) > td:nth-child(1)`)
        .text()
        .trim();
      const description = $(
        '#DatasetDetailsListing > tbody > tr:nth-child(2) > td:nth-child(2)'
      ).text();
      const hrefString = $(
        `#DatasetFilesListing > tbody > tr:nth-child(${index}) > td:nth-child(2) a`
      ).text();
      const href = $(
        `#DatasetFilesListing > tbody > tr:nth-child(${index}) > td:nth-child(2) a`
      ).attr('href');

      if (hrefString.match(/shape/gi)) {
        results.push({
          url: href,
          updated: 0,
          created: 0,
          description: description,
          name,
        });
      }
    }

    return results;
  });
};
