import fetch from 'node-fetch';
import AgsStream from 'ags-stream';
import { convert } from 'geojson2shp';

// https://www.npmjs.com/package/ags-stream
// ags-stream creates a readable stream of GeoJSON Features from an ArcGIS Server instance.
// This can be useful for scraping records from any ArcGIS Server or any other ETL process.

export default ({ database, DataScraper }) => {
  return DataScraper(database, 'Darlington', async () => {
    const results = [];

    const baseUrl =
      'https://services5.arcgis.com/8FJikaProY6O3ncx/ArcGIS/rest/services/PARCELS/FeatureServer';

    const urls = [
      fetch(`${baseUrl}/info/itemInfo?f=json`),
      fetch(`${baseUrl}/0?f=json`),
      fetch(`${baseUrl}/0/query?where=1=1&returnIdsOnly=true&f=json`),
    ];

    const [requestItemInfo, requestFields, requestObjectIds] = await Promise.all(urls);

    const { description, snippet, title } = await requestItemInfo.json();
    const { fields } = await requestFields.json();
    const { objectIds } = await requestObjectIds.json();

    const [{ name }] = fields.filter(obj => obj.type === 'esriFieldTypeOID') || [];

    const lowerBoundId = objectIds[0];
    const upperBoundId = objectIds[objectIds.length - 1];

    const shapesfileOutput = process.cwd(); // output for generated shapefiles
    const shapesfile = `${shapesfileOutput}/${lowerBoundId}_${upperBoundId}.zip`; // using lower bound id amd upper bound id for shapefile naming convention

    let sanitizeDescriptionHtml = '';

    if (description) {
      sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, '');
    }

    const agsStream = new AgsStream(`${baseUrl}/0`, {
      where: `${name}>=${lowerBoundId} and ${upperBoundId}<=${37675}`,
    });

    const feature = [];

    const start = Date.now();

    const geoJsonStream = () =>
      new Promise((resolve, reject) => {
        agsStream.on('data', data => {
          // data is an array of GeoJSON features
          data.forEach(geoJson => {
            feature.push(geoJson);
          });
        });
        agsStream.on('error', error => {
          const stop = new Date();
          console.log(`error elapsed time: ${(stop - start) / 1000} seconds`);
          reject(error);
        });
        agsStream.on('end', () => {
          const stop = new Date();
          console.log(`finish elapsed time: = ${(stop - start) / 1000} seconds`);
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
