import { sharing } from '../util/Sharing.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'idsForSharingArcGIS', async () => {
		let results = [];

		const ids = ['ccf7aa525143406da6e36f79e989b263', //JohnsCreekGa
			'09b293e309e54cc793bd1b9f4c1f0e4e', //OrangeCountyCa;
			'41dbc36ff1ab4554b54b5f0bb138bf73', //SanAntonioTx
		];

		for (let i = 0; i < ids.length; i++){
			let id = ids[i];
			results.push(...(await sharing({id}).catch(() => [])));
		}
		return results;
	});
};
