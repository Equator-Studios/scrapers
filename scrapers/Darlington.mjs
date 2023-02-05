import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Darlington', async () => {
		const baseUrl = 'https://services5.arcgis.com/8FJikaProY6O3ncx/ArcGIS/rest/services/PARCELS/FeatureServer';
		const layerNumber = 0;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
