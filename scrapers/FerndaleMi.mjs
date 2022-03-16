import fetch from "node-fetch";
import moment from "moment";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "FerndaleMi", async () => {
    const results = [];
    const baseUrl =
      "https://opendata.arcgis.com/api/v3/datasets/ebc18573de2d4721b51a0fb9e3b68635_0";
    const request = await fetch(baseUrl);
    const response = await request.json();
    const requestDownload = await fetch(`${baseUrl}/downloads`);
    const responseDownload = await requestDownload.json();

    const {
      attributes: { created, snippet },
    } = response.data;

    const { data } = responseDownload;

    const [shapesfile] = data.filter((item) => {
      const {
        attributes: { format },
      } = item;

      if (format === "shp") {
        return item;
      }
    });

    const {
      attributes: { lastModified },
      links: { content },
    } = shapesfile;

    const updated = moment(lastModified, "YYYY-MM-DDTHH:mm:ss.SSSSZ").unix();

    results.push({
      url: content,
      updated,
      created,
      description: snippet,
      name: snippet,
    });

    return results;
  });
};
