import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Dorchester', async () => {
		const baseUrl =
      'https://gisservices.dorchestercounty.net/arcgis/rest/services/Locations/Parcels_Only/MapServer';
		const layerNumber = 0;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
