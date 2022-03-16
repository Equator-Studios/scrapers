import fetch from "node-fetch";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "SanAntonioTx", async () => {
    const results = [];
    const baseUrl =
      "https://www.arcgis.com/sharing/rest/content/items/41dbc36ff1ab4554b54b5f0bb138bf73";
    const request = await fetch(`${baseUrl}/?f=json`);
    const response = await request.json();

    const { created, snippet, modified, name } = response;

    const description = response.description || "";

    const sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, "");

    const url = `${baseUrl}/data`;

    results.push({
      url,
      updated: modified,
      created,
      description: sanitizeDescriptionHtml,
      name: snippet || name,
    });

    return results;
  });
};
