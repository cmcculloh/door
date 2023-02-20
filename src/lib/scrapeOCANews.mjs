import { chromium } from "playwright";
import fs from "fs";

const getPageContents = () => {
	const title = document.querySelector(".categories header h1").textContent;
	// strip special characters from title
	const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
	// strip leading double spaces from title
	const titleCleaner = titleClean.replace(/  /, "");

	const date = new Date(document.querySelector(".categories header time").textContent);
	// date in YYYY/MM/DD format
	const dateClean = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

	const articleContents = [];

	// select all p and figure elements
	const pAndFigures = document.querySelectorAll(
		"#main-col-contents article > p, #main-col-contents article > figure"
	);

	document
		.querySelectorAll("#main-col-contents article > p, #main-col-contents article > figure")
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
	await page.goto(url);

	const links = await page.$$eval("#main-col-contents > .categories > article a", (as) =>
		as.map((a) => a.href)
	);

	let nextURL;

	try {
		nextURL = await page.$eval("#main-col-contents .pagination .next-button", (a) => a.href);
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
				console.log("existing reading fount", reading.title);
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

	let readings;
	try {
		const fileData = fs.readFileSync(`ocanews.json`, "utf8");
		readings = JSON.parse(fileData);
		// if readings.readings doesn't exist, create it
		if (!readings.readings) {
			readings.readings = [];
		}
	} catch (e) {
		console.log("error reading file", e);
	}

	const newReadings = await scrapeNewsForDay(page, `https://www.oca.org/news`, readings.readings);
	readings.readings = [...newReadings, ...readings.readings];
	readings.lastUpdated = new Date();

	fs.writeFileSync(`ocanews.json`, JSON.stringify(readings, null, "\t"));

	await browser.close();
};

export default scrapeNews;
