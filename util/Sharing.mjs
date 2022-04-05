import fetch from 'node-fetch';

export const sharing = async ({ id }) => {
	const results = [];
	const baseUrl = `https://www.arcgis.com/sharing/rest/content/items/${id}`;
	const request = await fetch(`${baseUrl}/?f=json`);
	const response = await request.json();

	const { created, snippet, modified, name, description } = response;

	const url = `${baseUrl}/data`;

	results.push({
		url: url || '',
		updated: modified || 0,
		created: created || 0,
		description: description || '',
		name: snippet || name,
	});

	return results;
};

export default sharing;
