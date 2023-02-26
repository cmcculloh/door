import { chromium } from "playwright";
import { saveReadings, getReadings } from "../utils/db.mjs";

const scrapePage = (opts) => {
	const { titleSelector, dateSelector, contentsSelector, type, source } = opts;

	const title = document.querySelector(titleSelector).textContent;
	// strip special characters from title
	const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
	// strip leading double spaces from title
	const titleCleaner = titleClean.replace(/  /, "");

	const date = new Date(document.querySelector(dateSelector).textContent);

	const articleContents = [];

	document.querySelectorAll(contentsSelector).forEach((el) => {
		articleContents.push(el.outerHTML);
	});

	const contents = articleContents.join("");

	return {
		title: titleCleaner,
		contents,
		url: window.location.href,
		date,
		type,
		source,
		scraped: new Date(),
	};
};

const scrapePages = async (opts, pageScrapeOpts) => {
	const {
		page,
		url,
		existingReadings = [],
		newReadings = [],
		counter = 0,
		linksSelector,
		nextSelector,
	} = opts;
	console.log("scraping", url);
	await page.goto(url);

	const links = await page.$$eval(linksSelector, (as) => as.map((a) => a.href));

	let nextURL;

	try {
		nextURL = await page.$eval(nextSelector, (a) => a.href);
	} catch (error) {
		console.log("no next button", error);
	}

	console.log("links", links);
	let stopScraping = false;

	for (const link of links) {
		// wait for a random number of seconds between 1 and 26
		// const waitTime = Math.floor(Math.random() * 3) + 1;
		// console.log("waiting", waitTime, "seconds");
		// await page.waitForTimeout(waitTime * 100);

		try {
			// follow link
			await page.goto(link);

			// scrape data
			const reading = await page.evaluate(scrapePage, pageScrapeOpts);

			// if reading isn't already in array, add it
			if (!existingReadings.find((r) => r.title === reading.title)) {
				console.log("adding", reading.title, "to readings");
				newReadings.push(reading);
			} else {
				console.log("existing reading found", reading.title);
				stopScraping = true;
			}
		} catch (error) {
			console.log("error", error);
			continue;
		}
	}

	// if we've scraped 7 days, stop
	// if (counter === 0) {
	// 	return newReadings;
	// }

	// if nextURL is undefined, stop
	if (!nextURL || stopScraping) {
		return newReadings;
	}

	return await scrapePages(
		{
			page,
			url: nextURL,
			existingReadings,
			newReadings,
			counter: counter + 1,
		},
		pageScrapeOpts
	);
};

const scrapeNewReadings = async (opts, pageScrapeOpts) => {
	// console.log("opts", opts, "pageScrapeOpts", pageScrapeOpts);
	const browser = await chromium.launch({ headless: false });

	opts.page = await browser.newPage();
	opts.existingReadings = await getReadings(pageScrapeOpts.source);

	const newReadings = await scrapePages(opts, pageScrapeOpts);

	saveReadings(newReadings);

	await browser.close();
};

export default scrapeNewReadings;
