import { chromium } from "playwright";
import { saveReadings, getReadingsBySourceAndType } from "../utils/db.mjs";
import throttle from "../utils/throttle.mjs";
import addIfUnique from "../utils/addIfUnique.mjs";
import getNextDay from "../utils/getNextDay.mjs";

const scrapeCommemorationsForDay = async (page, commemorations = [], day, counter = 0) => {
	const url = `https://www.oca.org/readings/daily/${day}`;
	console.log("scraping", url);
	await page.goto(url);
	await throttle(page);

	const reading = await page.evaluate(() => {
		const contents = document
			.querySelector("#main-col-contents > section > p")
			.innerHTML.replace(/  /, "");
		// strip newline and tab charagers from contents
		const contentsClean = contents.replace(/[\n\t]/g, "");

		const dateString = document.querySelector("#content-header h2").textContent;
		const title = `commemorations for ${dateString}`;

		// convert date string "Saturday, February 18, 2023" to "2023-02-18"
		// const date = new Date(dateString).toISOString().slice(0, 10);

		return {
			title,
			contents: contentsClean,
			url: window.location.href,
			date: new Date(dateString),
			type: "commemoration",
			source: "oca",
			scraped: new Date(),
		};
	});

	addIfUnique(commemorations, reading);

	const { nextDayString, nextDayYear } = getNextDay(day);

	// if we've scraped 7 days, stop
	if (counter === 1) {
		return commemorations;
	}

	// if year is the next year, stop
	if (nextDayYear === new Date(day).getFullYear() + 1) {
		return commemorations;
	}

	return await scrapeCommemorationsForDay(page, commemorations, nextDayString, counter + 1);
};

const scrapeCommemorations = async (startDayString, year) => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	const readings = await getReadingsBySourceAndType("oca", "commemoration");

	const newReadings = await scrapeCommemorationsForDay(page, readings, startDayString);

	saveReadings(newReadings);

	await browser.close();
};

export default scrapeCommemorations;
