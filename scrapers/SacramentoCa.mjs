import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'SacramentoCa', async () => {
		const baseUrl =
      'https://services1.arcgis.com/5NARefyPVtAeuJPU/ArcGIS/rest/services/Parcels/FeatureServer';
		const layerNumber = 0;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
