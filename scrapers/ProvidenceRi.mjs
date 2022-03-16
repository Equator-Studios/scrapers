import fetch from "node-fetch";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "ProvidenceRi", async () => {
    const results = [];
    const baseUrl = "https://data.providenceri.gov";
    const request = await fetch(`${baseUrl}/api/views/ynak-nf84`);
    const response = await request.json();

    const {
      createdAt,
      viewLastModified,
      description,
      name,
      metadata: {
        geo: { owsUrl },
      },
    } = response;
    const url = `${baseUrl}${owsUrl}?method=export&format=Shapefile`;

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
