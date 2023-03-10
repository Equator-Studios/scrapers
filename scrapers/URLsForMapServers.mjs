import { mapserver } from '../util/MapServer.mjs';

export default ({ database, DataScraper }) => {
	return DataScraper(database, 'URLsForMapServers', async () => {
		let results = [];

		const baseUrls = [{ //Anderson
			baseUrl: 'https://propertyviewer.andersoncountysc.org/arcgis/rest/services/Parcel_Sales/MapServer',
			layerNumber: 0
		},
		{ //Beaufort
			baseUrl: 'https://gis.beaufortcountysc.gov/server/rest/services/ParcelsWithAssessorData/MapServer',
			layerNumber: 0
		},
		{ //Berkeley
			baseUrl: 'https://gis.berkeleycountysc.gov/arcgis/rest/services/desktop/internet_map/MapServer',
			layerNumber: 3
		},
		{ //Charleston
			baseUrl: 'https://gisccapps.charlestoncounty.org/arcgis/rest/services/GIS_VIEWER/Public_Search/MapServer',
			layerNumber: 4
		},
		{ //Clayton currently broken
			baseUrl: 'https://weba.co.clayton.ga.us:5443/server/rest/services/PlanningZoning/ZoningData/MapServer',
			layerNumber: 5
		},
		{ //Columbia
			baseUrl: 'https://mapsonline.columbiacountyga.gov/arcgis/rest/services/Map_LayersJS/MapServer',
			layerNumber: 68
		},
		{ //Darlington
			baseUrl: 'https://services5.arcgis.com/8FJikaProY6O3ncx/ArcGIS/rest/services/PARCELS/FeatureServer',
			layerNumber: 0
		},
		{ //DentonTx
			baseUrl: 'https://gis.cityofdenton.com:9002/arcgis/rest/services/MapViewer/Property/MapServer',
			layerNumber: 2
		},
		{ //Dorchester
			baseUrl: 'https://gisservices.dorchestercounty.net/arcgis/rest/services/Locations/Parcels_Only/MapServer',
			layerNumber: 0
		},
		{ //FortLauderdaleFl
			baseUrl: 'https://gis.fortlauderdale.gov/server/rest/services/TaxParcel/MapServer',
			layerNumber: 0
		},
		{ //Gwinnet
			baseUrl: 'https://gis3.gwinnettcounty.com/mapvis/rest/services/OnPoint/GC_Parcel/MapServer',
			layerNumber: 9
		},
		{ //Horry currently broken
			baseUrl: 'https://www.horrycounty.org/gisweb/rest/services/OpenData/Parcel_Geometry/MapServer',
			layerNumber: 0
		},
		{ //Lexington
			baseUrl: 'https://maps.lex-co.com/agstserver/rest/services/Property/MapServer',
			layerNumber: 4
		},
		{ //Liberty
			baseUrl: 'https://gis.libertycountyga.com/arcgis/rest/services/Parcels/MapServer',
			layerNumber: 0
		},
		{ //NashvilleTn
			baseUrl: 'https://maps.nashville.gov/arcgis/rest/services/Cadastral/Parcels/MapServer',
			layerNumber: 0
		},
		{ //OklahomaCityOk
			baseUrl: 'https://oklahomacounty.geocortex.com/arcgis/rest/services/ParcelData/OklahomaCountyAllParcelsData4/MapServer',
			layerNumber: 10
		},
		{ //Paulding
			baseUrl: 'https://arcgis5.roktech.net/arcgis/rest/services/Paulding/GoMaps4/MapServer',
			layerNumber: 36
		},
		{ //Richmond
			baseUrl: 'https://gismap.augustaga.gov/arcgis/rest/services/Map_LayersJS/MapServer',
			layerNumber: 316
		},
		{ //SacramentoCa
			baseUrl: 'https://services1.arcgis.com/5NARefyPVtAeuJPU/ArcGIS/rest/services/Parcels/FeatureServer',
			layerNumber: 0
		},
		{ //Saluda
			baseUrl: 'https://saludacountysc.net/arcgis/rest/services/ParcelViewers/PublicWebsite/MapServer',
			layerNumber: 4
		},
		// { //Sumter currently broken, not timing out
		//	 baseUrl: 'http://svr4.sumtercountysc.org:6080/arcgis/rest/services/Parcel_Search/Parcel_Base/MapServer',
		//	 layerNumber: 0
		// },
		{ //VirginiaBeachVa
			baseUrl: 'https://gismaps.vbgov.com/arcgis/rest/services/Basemaps/PropertyInformation/MapServer',
			layerNumber: 12
		},
		{ //Whitfield
			baseUrl: 'https://gis.whitfieldcountyga.com/server/rest/services/Parcels_and_Development/MapServer',
			layerNumber: 5
		},];

		for (let i = 0; i < baseUrls.length; i++){
			let baseUrl = baseUrls[i].baseUrl;
			let layerNumber = baseUrls[i].layerNumber;
			try{
				results.push(...(await mapserver({baseUrl, layerNumber})));
			}
			catch{
				continue;
			}
		}
		return results;
	});
};
