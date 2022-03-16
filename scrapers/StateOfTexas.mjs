import fetch from "node-fetch";
import moment from "moment";

export default ({ database, DataScraper }) => {
  return DataScraper(database, "StateOfTexas", async () => {
    const data = [];
    const baseUrl = "https://api.tnris.org/api/v1";
    const id = "2679b514-bb7b-409f-97f3-ee3879f34448";
    const collections = `collections/${id}`;
    const resources = `resources?collection_id=${id}`;
    const collectionsRequest = await fetch(`${baseUrl}/${collections}`);
    const collection = await collectionsRequest.json();
    const resourcesRequest = await fetch(`${baseUrl}/${resources}`);
    const resource = await resourcesRequest.json();

    const { publication_date, description, name } = collection;
    const { results } = resource;
    const created = moment(publication_date, "YYYY-MM-DD").unix();

    results.map((item) => {
      return data.push({
        url: item.resource,
        updated: 0,
        created,
        description,
        name,
      });
    });

    return data;
  });
};
