import { searchportal } from '../util/SearchPortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'URLsForSearchPortal', async () => {
		let results = [];

		const baseUrls = ['https://bostonopendata-boston.opendata.arcgis.com', //BostonMa
			'https://data-cuyahoga.opendata.arcgis.com', //CleavelandOh currently broken
			'https://live-durhamnc.opendata.arcgis.com', //DurhamNc
			'https://opendata-fallschurch.opendata.arcgis.com', //FallsChurchVa
			'https://www.nconemap.gov', //NorthCarolina
			'https://opendata.gis.utah.gov', //SaltLakeCityUt
			'https://data-sagis.opendata.arcgis.com', //SavannahGa
			'https://opendata.dc.gov', //WashingtonDc
		];

		for (let i = 0; i < baseUrls.length; i++){
			let baseUrl = baseUrls[i];
			try{
				results.push(...(await searchportal({baseUrl})));
			}
			catch{
				continue;
			}
		}
		return results;
	});
};
