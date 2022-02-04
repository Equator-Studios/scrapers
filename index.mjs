import nodefs from 'fs';
const fs = nodefs.promises;

const names = new Set();
const database = {};
const returnObj = {};
const scrapers = [];

const DataScraper = (...args) => {
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

const loadScrapers = async (folder, scrapers) => {
	for (const scraperName of scrapers) {
		const scraper = await import (`./${folder}/${scraperName}`);

		if (typeof scraper.default !== 'function') {
			throw new Error(`${scraperName} must export a function as its default export`);
		}

		if (scraper.default({database, DataScraper}) !== returnObj) {
			throw new Error("The scraper default function export must pass through the return value of Scraper.mjs");
		}
	}
}

const loadFolder = async (folder) => {
	let testScrapers = await fs.readdir(folder).catch(() => []);
	if (testScrapers.length) {
		await loadScrapers(folder, testScrapers);

		return true;
	}

	return false;
}

(async () => {
	loaders: {
		if (await loadFolder('test')) break loaders;
		if (await loadFolder('scrapers')) break loaders;
	}

	//run all the scrapers
	for (const {name, callback} of scrapers) {
		console.log("Running scraper:", name);
		let data = await Promise.resolve(callback());

		console.log(data);

		//validate the data
		for (const entry of data) {
			try {
				if (typeof entry.updated !== 'number') throw new Error("One or more entries returned did not have a valid updated entry");
				if ('created' in entry && typeof entry.created !== 'number') throw new Error("One or more entries returned did not have a valid created entry");
				if (typeof entry.name !== 'string') throw new Error("One or more entries returned did not have a valid name");
				if (typeof entry.url !== 'string') throw new Error("One or more entries returned did not have a valid url");
				if ('description' in entry && typeof entry.description !== 'string') throw new Error("One or more entries returned did not have a valid description");
			} catch (e) {
				console.log('Suspect data:', entry);

				throw e;
			}
		}
	}

	if (scrapers.length) {
		process.exit(0);
	}else{
		console.error("Found no scrapers to run!");
		process.exit(1);
	}
})();
