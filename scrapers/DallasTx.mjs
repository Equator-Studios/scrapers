import fetch from "node-fetch";
import cheerio from "cheerio";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "DallasTx", async () => {
    const results = [];
    const baseUrl = "https://www.dallascad.org";
    const request = await fetch(`${baseUrl}/GISDataProducts.aspx`);
    const response = await request.text();
    const $ = cheerio.load(response);
    const links = $("a");

    links.map((index, elem) => {
      const href = $(elem).attr("href");
      const text = $(elem).text();

      if (href !== undefined && href.match(/parcel/gi)) {
        const url = `${baseUrl}/${href}`;
        const [name, description] = text.trim().split("-");
        return results.push({
          url: encodeURI(url),
          updated: 0,
          created: 0,
          description,
          name,
        });
      }
    });

    return results;
  });
};
