import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Paulding', async () => {
		const baseUrl = 'https://arcgis5.roktech.net/arcgis/rest/services/Paulding/GoMaps4/MapServer';
		const layerNumber = 36;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
