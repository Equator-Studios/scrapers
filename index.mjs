import nodefs from 'fs';
import {database, scrapers, returnObj} from './Scraper.mjs';
const fs = nodefs.promises;

const loadScrapers = async (folder, scrapers) => {
	for (const scraperName of scrapers) {
		const scraper = await import (`./${folder}/${scraperName}`);

		if (typeof scraper.default !== 'function') {
			throw new Error(`${scraperName} must export a function as its default export`);
		}

		if (scraper.default({database}) !== returnObj) {
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
