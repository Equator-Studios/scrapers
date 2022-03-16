import fetch from "node-fetch";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "NewYorkCityNY", async () => {
    const results = [];
    const baseUrl = "https://data.cityofnewyork.us";
    const request = await fetch(`${baseUrl}/api/views/smk3-tmxj`);
    const response = await request.json();

    const { blobId, createdAt, viewLastModified, description, name } = response;
    const url = `${baseUrl}/files/${blobId}`;

    results.push({
      url,
      updated: viewLastModified,
      created: createdAt,
      description,
      name,
    });

    return results;
  });
};
