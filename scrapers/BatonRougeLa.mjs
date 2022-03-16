import fetch from "node-fetch";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "BatonRougeLa", async () => {
    const results = [];
    const baseUrl = "https://data.brla.gov/api/views/re5c-hrw9";
    const request = await fetch(baseUrl);
    const response = await request.json();

    const { createdAt, viewLastModified, description, name } = response;
    const url = `${baseUrl}/rows.csv?accessType=DOWNLOAD`;

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
