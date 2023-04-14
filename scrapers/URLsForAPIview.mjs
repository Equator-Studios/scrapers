import apiview from '../util/ApiView.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'URLsForAPIview', async () => {
		let results = [];

		const baseUrls = [{ //BatonRougeLa
			baseUrl: 'https://data.brla.gov',
			id: 're5c-hrw9'
		},
		{ //KansasCityMo
			baseUrl: 'https://data.kcmo.org',
			id: 'vrys-qgrz'
		},
		{ //KingCountyWashington
			baseUrl: 'https://data.kingcounty.gov',
			id: '5idm-g74e'
		},
		{ //NewYorkCityNY
			baseUrl: 'https://data.cityofnewyork.us',
			id: 'smk3-tmxj'
		},
		{ //ProvidenceRi
			baseUrl: 'https://data.providenceri.gov',
			id: 'ynak-nf84'
		},
		{ //RichmondVa currently broken
			baseUrl: 'https://data.richmondgov.com',
			id: 'b52i-7ygb'
		},
		{ //SantaMonicaCa currently broken
			baseUrl: 'https://data.smgov.net',
			id: 'sa4y-7yah'
		}];

		for (let i = 0; i < baseUrls.length; i++){
			let baseUrl = baseUrls[i].baseUrl;
			let id = baseUrls[i].id;
			results.push(...(await apiview({baseUrl, id}).catch(() => [])));
		}
		return results;
	});
};
