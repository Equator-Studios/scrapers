import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'SanDiegoCa', async () => {
		const results = [];
		const baseUrl = 'https://rdw.sandag.org/Account';
		const loginUrl = `${baseUrl}/Login`;
		const username = 'ampleinsight@maildrop.cc';
		const password = 'ampleinsight';

		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(loginUrl, { waitUntil: 'networkidle0' });
		await page.type('#MainContent_Email', username);
		await page.type('#MainContent_Password', password);
		await Promise.all([
			page.click('.btn-default'),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
			page.click('.btn-default'),
		]);

		await Promise.all([
			page.waitForNavigation('domcontentloaded'),
			page.click('#MainContent_dataList1 > tbody > tr:nth-child(1) > td:nth-child(4) > a'),
		]);

		const html = await page.evaluate(() => {
			return {
				markup: document.documentElement.innerHTML,
			};
		});

		await browser.close();

		const $ = cheerio.load(html.markup);

		const tableRow = $('#MainContent_dataList2 > tbody > tr > td:nth-child(2n+2)');

		tableRow.map((index, elem) => {
			const href = $(elem).children('a').attr('href');
			const hrefString = $(elem).text().trim();
			const url = `${baseUrl}/${href}`;
			return results.push({
				url,
				updated: 0,
				created: 0,
				description: '',
				name: hrefString,
			});
		});

		return results;
	});
};
