import fetch from 'node-fetch';
import cheerio from 'cheerio';
import moment from 'moment';
import puppeteer from 'puppeteer';
// using puppeteer due to the the limitation of calling the https://opendata.arcgis.com/api/v3/search
// API directly. Prior mention API requires a POST with a well-form request payload. Unable to determine
// a generic/common request payload to make a successful POST.

export const searchportal = async ({ baseUrl }) => {
	const results = [];
	const arcgisUrl = 'https://opendata.arcgis.com/api/v3/datasets';
	const request = `${baseUrl}/search?collection=Dataset&q=parcels`;
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

	for (let index = 0; index < links.length; index++) {
		const elem = links[index];
		const href = $(elem).attr('href');
		const hrefString = $(elem).text();
		const link = `${baseUrl}${href}`;
		if (hrefString.match(/parcel/gi)) {
			urls.push(link);
		}
	}

	const fetchUrls = urls.map(request => fetch(request));
	const responses = await Promise.all(fetchUrls);

	const requests = responses.map(request => request.text());
	const dataset = await Promise.all(requests);

	const arcgisIds = [];
	const arcgisUrls = [];

	for (let index = 0; index < dataset.length; index++) {
		const html = dataset[index];
		const $ = cheerio.load(html);
		const content = $('meta[name="twitter:image"]').attr('content');
		const [parts] = content.split('/info');
		const [, id] = parts.split('items/');
		arcgisIds.push(`${arcgisUrl}/${id}`);
		arcgisUrls.push(`${arcgisUrl}/${id}/downloads`);
	}

	const fetchArcgisUrls = arcgisUrls.map(request => fetch(request));
	const responsesArcgisUrls = await Promise.all(fetchArcgisUrls);

	const requestsArcgisUrls = responsesArcgisUrls.map(request => request.json());
	const datasetArcgisUrl = await Promise.all(requestsArcgisUrls);

	for (let index = 0; index < datasetArcgisUrl.length; index++) {
		const item = datasetArcgisUrl[index];
		const { data = [] } = item || {};
		const shapesfile = data.find(item => {
			const {
				attributes: { format },
			} = item;

			return format === 'shp';
		});

		if (shapesfile && shapesfile !== undefined) {
			const {
				attributes: {
					lastModified,
					source: { url },
				},
				links: { content },
			} = shapesfile;

			const updated = moment(lastModified, 'YYYY-MM-DDThh:mm:ss.SSSSZ').unix();

			results.push({
				url: content || url || '',
				updated: updated || 0,
				created: 0,
				description: '',
				name: '',
			});
		}
	}

	const fetchArcgisIds = arcgisIds.map(request => fetch(request));
	const responsesArcgisIds = await Promise.all(fetchArcgisIds);

	const requestsArcgisIds = responsesArcgisIds.map(request => request.json());
	const datasetArcgisIds = await Promise.all(requestsArcgisIds);

	for (let index = 0; index < datasetArcgisIds.length; index++) {
		const item = datasetArcgisIds[index];
		const {
			data: {
				attributes: { description, created, snippet, name },
			},
		} = item;

		if (results[index] !== undefined) {
			results[index].description = description || '';
			results[index].created = created || 0;
			results[index].name = snippet || name || '';
		}
	}

	return results;
};

export default searchportal;
