import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'VirginiaBeachVa', async () => {
		const baseUrl = 'https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PropertyInformation/MapServer';
		const layerNumber = 12;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
