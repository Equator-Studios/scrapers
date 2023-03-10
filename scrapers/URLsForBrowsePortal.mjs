import { browseportal } from '../util/BrowsePortal.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'URLsForBrowsePortal', async () => {
		let results = [];

		const baseUrls = ['https://data.muni.org', //AnchorageAk currently broken?
			'https://data.austintexas.gov', //AustinTx
			'https://www.chattadata.org', //ChattanoogaTn
			'https://datacatalog.cookcountyil.gov', //ChicagoIl
			'https://www.dallasopendata.com', //Dallas,
			'https://data.lacity.org', //LosAngelesCa
			'https://data.oaklandca.gov', //OaklandCa
			'https://data.sfgov.org', //SanFranciscoCa
			'https://data.seattle.gov/', //SeattleWa currently broken
		];

		for (let i = 0; i < baseUrls.length; i++){
			let baseUrl = baseUrls[i];
			try{
				results.push(...(await browseportal({baseUrl})));
			}
			catch{
				continue;
			}
		}
		return results;
	});
};
