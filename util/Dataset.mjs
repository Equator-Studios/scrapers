import fetch from 'node-fetch';
import moment from 'moment';

export const dataset = async ({ id }) => {
	const results = [];
	const baseUrl = `https://opendata.arcgis.com/api/v3/datasets/${id}`;
	const request = await fetch(baseUrl);
	const response = await request.json();
	const requestDownload = await fetch(`${baseUrl}/downloads`);
	const responseDownload = await requestDownload.json();

	const {
		attributes: { description, created, snippet },
	} = response.data;

	const { data } = responseDownload;

	const shapesfile = data.find(item => {
		const {
			attributes: { format },
		} = item;

		return format === 'shp';
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
		description: description || '',
		name: snippet || '',
	});

	return results;
};

export default dataset;
