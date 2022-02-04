# scrapers
This repository contains some of the data scrapers we use at www.equatorstudios.com
for us to allow users to discover data using the search feature. There are systems
put in place where the scrapers are run peridically to refresh what is available
in the search feature. Take a look at the scrapers/RedDeer.js example as an easy
way to grap how this works, we simply have a callback funciton that takes three
paramaters:

1. a database object - this must be passed through (is only used in our real
deployment and not in the shim we use specifically for this project)
2. the name of the datascraper which needs to be unique across all our data
scrapers
3. A async callback function that should return an array with the metadata that
our systems will use to download the data and process it. Here is the metadata
that it accepts:
	- required: URL - the actual url that the shapefile is available at
	- required: updated - last time the data was updated. This lets us know when
	to re-process the data and update the listing within the search tool.
	- required: name - the name of the particual dataset. This name is shown
	to users.
	- optional: created - when the data was first hosted by the data provider
	- optional: description - a description of the data. Proper due diligance
	in terms of attribution is required, so technically not a "optional" field
	in accordance to law. The description field is shown to users if available.
	The description can contain html.

# Project layout
Any new datascrapers should go into the scrapers folder. New scrapers shouldn't
need to touch any code since scapers will automatically be registered and ran
with the index.js testing script. As a bonus developer friendly feature, to
avoid running other scrapers when the intention is to test a new one, a `test`
folder can be made next to the existing `scrapers` folder and project will
only load what is in the text folder if available. When creating the PR, make
sure to move the finished scraper from the test folder into the scrapers folder.

# Running the project
After cloning the repository, you must install the dependencies. We use npm
or other compatible package managers. More details below. To install the
dependencies run `npm install`. After which with a sufficiently up to date
node/npm running `npm start` from within the terminal should be enough.

To install nodejs/npm for linux distributions, use
the package manager that your distribution provides. Details are available at
https://nodejs.org/en/download/package-manager/.

On windows/macintosh, the npm homepage https://nodejs.org/en/ provides
installation wizards. Any version should do.