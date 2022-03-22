import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
import puppeteer from 'puppeteer';

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Wisconsin', async () => {
    const results = [];
    const baseUrl = 'https://www.sco.wisc.edu/parcels/data-county/#v700';
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

    const tableRow = $('.table > tbody > tr');

    tableRow.map((index, elem) => {
      const name = $(`.table > tbody > tr:nth-child(${index}) > th`).text();
      const description = $(`.survey-link-text`).text();
      const sanitizeDescriptionHtml = description
        .replace(/(<([^>]+)>)/gi, '')
        .replace(/\t+/gi, '')
        .replace(/\n+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      const url =
        $(`.table > tbody > tr:nth-child(${index}) > td:nth-child(2) a`).attr('href') ||
        'Not available';
      return results.push({
        url,
        updated: 0,
        created: 0,
        description: sanitizeDescriptionHtml || '',
        name,
      });
    });

    return results;
  });
};
