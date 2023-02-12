import fetch from "node-fetch";
import moment from "moment";

export default ({ database, DataScraper }) => {
	return DataScraper(database, "StateOfTexas", async () => {
		const data = [];
		const baseUrl = "https://api.tnris.org/api/v1";
		//fetching the collection_id
		const idData = await fetch(
			"https://api.tnris.org/api/v1/collections_catalog/"
		).then((response) => response.json());
		//extracting collection_id values into array
		const idArray = idData.results.map((item) => item["collection_id"]);

		for (const id of idArray) {
			//setting endpoints for 'collection_id'
			const collections = `collections/${id}`;
			const resources = `resources?collection_id=${id}`;
			//making 2 fetch requests
			//storing response using destructuring assignment
			const [collectionsData, resourcesData] = await Promise.all([
				fetch(`${baseUrl}/${collections}`).then((res) => res.json()),
				fetch(`${baseUrl}/${resources}`).then((res) => res.json()),
			]);
			const { publication_date, description, name } = collectionsData;
			const { results } = resourcesData;
			const created = moment(publication_date, "YYYY-MM-DD").unix();

			results.forEach((item) => {
				data.push({
					url: item.resource,
					updated: 0,
					created,
					description,
					name,
				});
			});
		}
		return data;
	});
};