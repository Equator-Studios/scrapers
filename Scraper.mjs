const names = new Set();
export const database = {};
export const returnObj = {};
export const scrapers = [];

export default (...args) => {
	if (args.length !== 3) {
		throw new Error ("The scraper function must be given 3 paramaters");
	}

	const [db, name, callback] = args;
	if (database !== db) {
		throw new Error("The database object must be sent through");
	}

	if (typeof name !== 'string') {
		throw new Error("The name paramater must be a string");
	}

	if (names.has(name)) {
		throw new Error("That name is already used by another data scraper");
	}else{
		names.add(name);
	}

	if (typeof callback !== 'function') {
		throw new Error("The callback must be a function");
	}

	scrapers.push({
		name, callback
	});

	return returnObj;
}