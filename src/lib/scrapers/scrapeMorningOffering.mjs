import { chromium } from "playwright";
import { saveNewReadings, getCurrentReadings } from "../utils/fileAccess.mjs";

const getPageContents = () => {
	const title = document.querySelector("#main > article > header > h1").textContent;
	// strip special characters from title
	const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
	// strip leading double spaces from title
	const titleCleaner = titleClean.replace(/  /, "");

	const date = new Date(
		document.querySelector("#main > article > header time.published").textContent
	);
	// date in YYYY/MM/DD format
	const dateClean = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

	const articleContents = [];

	document
		.querySelectorAll(
			".entry-content > p, .entry-content > ol, .entry-content > ul, .entry-content > figure"
		)
		.forEach((el) => {
			articleContents.push(el.outerHTML);
		});

	const contents = articleContents.join("");

	return {
		title: titleCleaner,
		contents,
		source: window.location.href,
		date: dateClean,
	};
};

const scrapeNewsForDay = async (
	page,
	url,
	existingReadings = [],
	newReadings = [],
	counter = 0
) => {
	console.log("scraping", url);
	await page.goto(url);

	const links = await page.$$eval("#main > article.post > header > h2 > a", (as) =>
		as.map((a) => a.href)
	);

	let nextURL;

	try {
		nextURL = await page.$eval("#main .pagination .pnav-next", (a) => a.href);
	} catch (error) {
		console.log("no next button", error);
	}

	console.log("links", links);
	let stopScraping = false;

	for (const link of links) {
		// wait for a random number of seconds between 1 and 26
		const waitTime = Math.floor(Math.random() * 3) + 1;
		console.log("waiting", waitTime, "seconds");
		await page.waitForTimeout(waitTime * 100);

		try {
			// follow link
			await page.goto(link);

			// scrape data
			const reading = await page.evaluate(getPageContents);

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

	return await scrapeNewsForDay(page, nextURL, existingReadings, newReadings, counter + 1);
};

const scrapeNews = async () => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	const readings = await getCurrentReadings(`nootherfoundation.json`);

	const newReadings = await scrapeNewsForDay(
		page,
		`https://blogs.ancientfaith.com/nootherfoundation/`,
		readings.readings
	);

	saveNewReadings(`nootherfoundation.json`, readings, newReadings);

	await browser.close();
};

export default scrapeNews;
