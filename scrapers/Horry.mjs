import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'Horry', async () => {
		const baseUrl = 'https://www.horrycounty.org/gisweb/rest/services/OpenData/Parcel_Geometry/MapServer';
		const layerNumber = 0;

		const results = await mapserver({ baseUrl, layerNumber });

		return results;
	});
};
