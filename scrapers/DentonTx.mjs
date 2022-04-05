import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'DentonTx', async () => {
		const baseUrl =
      'https://gis.cityofdenton.com:9002/arcgis/rest/services/MapViewer/Property/MapServer';
		const layerNumber = 2;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
