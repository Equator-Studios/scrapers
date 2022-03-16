import fetch from "node-fetch";
import cheerio from "cheerio";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "AlbuquerqueNm", async () => {
    const results = [];
    const baseUrl = "http://www.cabq.gov";
    const request = await fetch(
      `${baseUrl}/gis/geographic-information-systems-data`
    );
    const response = await request.text();
    const $ = cheerio.load(response);

    const tableRow = $(".table > tbody > tr");

    tableRow.map((index, elem) => {
      const name = $(`.table > tbody > tr:nth-child(${index}) > th`).text();
      const description = $(
        `.table > tbody > tr:nth-child(${index}) > td:nth-child(2)`
      ).text();
      const url =
        $(`.table > tbody > tr:nth-child(${index}) > td:nth-child(4) a`).attr(
          "href"
        ) || "Not available";

      console.log(url);

      return results.push({
        url,
        updated: 0,
        created: 0,
        description,
        name,
      });
    });

    return results;
  });
};
