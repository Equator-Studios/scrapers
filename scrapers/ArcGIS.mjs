import { dataset } from '../util/Dataset.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'ArcGIS', async () => {
        let results = [];

		const ids = [//'b70198178ff44462b00c5b5c0012668d_0', //ArlingtonVa currently broken
        '8cae9e82135d4bd0925f8c5e71254924_0', //AtlantaGa
        '85767997c73d4b9292415f2661466273_0', //'BaltimoreMd'
        //'b919780fc011446389c560fb91315595_3', //CharlotteNc currently broken
        // 'a09b19515cdd4ce4b07e0bc3406ff0b9_10', //ChesapeakeVa currently broken
        //'101b808f4c134959aa0263667aef7953_0', //CincinnatiOh currently broken
        '9ca25373d4f747be85850344186dda3c_0', //DetroitMi
        'ebc18573de2d4721b51a0fb9e3b68635_0', //FerndaleMi
        //'2d26a31d2e1541a4bfc68aac77f212a0_1', //Georgetown currently broken
        '1a89b7b4de56414088c854c4f785e3e7_0', //LasVegasNv
        'e4a525d8772741468205e82fc173db22_0', //LexingtonKy
        '47085b87ac754d60942ea324a3b0f54f_1', //LouisvilleKy
        '347bce97227c4b54b04a3e626b558950_0', //MiamiDadeFl
        '273cc01f8dae4765b2924ba5de028c27_0', //NewOrleansLa
        'a516ce5d20b3431baae9ba99b256cb08_1', //NorfolkVa
        '29b5ee8f17694f3d9f0bbfd9ba1945f8_0', //RaleighNc
        // 'd53885b540f0444196356290a13a779d_0', //RiversideCa currently broken
        'c2a97c7a8f4b42d280f8113765d9b635_0', //SanDiego
        '4bb085cb99a64eff8e83d2bf92a8d5cb_270', //SanJoseCa
        ];

        for (let i = 0; i < ids.length; i++){
            let id = ids[i]
            try{
                results.push(...(await dataset({id})))
            }
            catch{
                continue
            }
        }
		return results;
	});
};
