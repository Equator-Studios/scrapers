import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Beaufort', async () => {
		const baseUrl = 'https://gis.beaufortcountysc.gov/server/rest/services/ParcelsWithAssessorData/MapServer';
		const layerNumber = 0;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
