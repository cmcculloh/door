import { chromium } from "playwright";
import { saveReadings, getReadings } from "../utils/db.mjs";

const scrapePage = (opts) => {
	const { titleSelector, dateSelector, imgSelector, contentsSelector, type, source, forceYear } =
		opts;

	const title = document.querySelector(titleSelector).textContent;
	// strip special characters from title
	const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
	// strip leading double spaces from title
	const titleCleaner = titleClean.replace(/  /, "");

	const date = new Date(document.querySelector(dateSelector).textContent);

	if (forceYear) {
		date.setFullYear(forceYear);
	}

	const articleContents = [];

	if (imgSelector) {
		const imgLink = document.querySelector(imgSelector);
		if (imgLink) {
			articleContents.push(`<p>${imgLink.innerHTML}</p>`);
		}
	}

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
		limit = 0,
		ignoreExisting = false,
	} = opts;
	console.log("scraping", url);
	await page.goto(url);

	// console.log("getting links with selector", linksSelector);
	const links = await page.$$eval(linksSelector, (as) => as.map((a) => a.href));

	let nextURL;

	try {
		nextURL = await page.$eval(nextSelector, (a) => a.href);
	} catch (error) {
		console.log("no next button", error);
	}

	// console.log("links", links);
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

			const alreadyExists = existingReadings.find((r) => r.title === reading.title);

			// if reading isn't already in array, add it
			if (ignoreExisting || !alreadyExists) {
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
	if (limit > 0 && counter === limit) {
		return newReadings;
	}

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
			linksSelector,
			nextSelector,
			limit,
			ignoreExisting,
		},
		pageScrapeOpts
	);
};

const scrapeNewReadings = async (opts, pageScrapeOpts) => {
	// console.log("opts", opts, "pageScrapeOpts", pageScrapeOpts);
	const browser = await chromium.launch({ headless: true });

	opts.page = await browser.newPage();
	opts.existingReadings = await getReadings(pageScrapeOpts.source);

	const newReadings = await scrapePages(opts, pageScrapeOpts);

	saveReadings(newReadings);

	await browser.close();
};

export default scrapeNewReadings;
