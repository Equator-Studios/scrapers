import fetch from 'node-fetch';
import AgsStream from 'ags-stream';
import { convert } from 'geojson2shp';

// https://www.npmjs.com/package/ags-stream
// ags-stream creates a readable stream of GeoJSON Features from an ArcGIS Server instance.
// This can be useful for scraping records from any ArcGIS Server or any other ETL process.

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'SacramentoCa', async () => {
    const results = [];

    const baseUrl =
      'https://services1.arcgis.com/5NARefyPVtAeuJPU/ArcGIS/rest/services/Parcels/FeatureServer';
    const dataUrl = `${baseUrl}/0`;
    const urls = [
      fetch(`${baseUrl}/info/itemInfo?f=json`),
      fetch(`${dataUrl}?f=json`),
      fetch(`${dataUrl}/query?where=1=1&returnIdsOnly=true&f=json`),
    ];

    const [requestItemInfo, requestFields, requestObjectIds] = await Promise.all(urls);

    const { description, snippet, title } = await requestItemInfo.json();
    const { fields } = await requestFields.json();
    const { objectIds } = await requestObjectIds.json();

    const [{ name }] = fields.filter(obj => obj.type === 'esriFieldTypeOID') || [];

    const sortObjectIds = objectIds.sort((a, b) => {
      return a - b;
    });
    const lowerBoundId = sortObjectIds[0];
    const upperBoundId = sortObjectIds[objectIds.length - 1];

    const shapesfileOutput = process.cwd(); // output for generated shapefiles
    const shapesfile = `${shapesfileOutput}/${lowerBoundId}_${upperBoundId}.zip`; // using lower bound id amd upper bound id for shapefile naming convention

    let sanitizeDescriptionHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
    }

    const agsStream = new AgsStream(dataUrl, {
      where: `${name}>=${lowerBoundId} and ${name}<=${upperBoundId}`,
    });

    const feature = [];

    const geoJsonStream = () =>
      new Promise((resolve, reject) => {
        agsStream.on('data', data => {
          // data is an array of GeoJSON features
          data.forEach(geoJson => {
            feature.push(geoJson);
          });
        });
        agsStream.on('error', error => {
          reject(error);
        });
        agsStream.on('end', () => {
          resolve();
        });
      });

    await geoJsonStream();
    await convert(feature, shapesfile, {});

    results.push({
      url: shapesfile,
      updated: 0,
      created: 0,
      description: sanitizeDescriptionHtml,
      name: snippet || title,
    });

    return results;
  });
};
