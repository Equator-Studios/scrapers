import fetch from "node-fetch";
import moment from "moment";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "NewOrleansLa", async () => {
    const results = [];
    const baseUrl =
      "https://opendata.arcgis.com/api/v3/datasets/273cc01f8dae4765b2924ba5de028c27_0";
    const request = await fetch(baseUrl);
    const response = await request.json();
    const requestDownload = await fetch(`${baseUrl}/downloads`);
    const responseDownload = await requestDownload.json();

    const {
      attributes: { description, created, snippet },
    } = response.data;

    const sanitizeDescriptionHtml = description.replace(/(<([^>]+)>)/gi, "");

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
      description: sanitizeDescriptionHtml,
      name: snippet,
    });

    return results;
  });
};
