import { chromium } from "playwright";
import { saveNewReadings, getCurrentReadings } from "../utils/fileAccess.mjs";

const scrapeCommemorationsForDay = async (page, commemorations = [], day, counter = 0) => {
	const url = `https://www.oca.org/readings/daily/${day}`;
	console.log("scraping", url);
	await page.goto(url);

	const reading = await page.evaluate(() => {
		const title = `commemorations for today`;
		const contents = document
			.querySelector("#main-col-contents > section > p")
			.innerHTML.replace(/  /, "");
		// strip newline and tab charagers from contents
		const contentsClean = contents.replace(/[\n\t]/g, "");

		const dateString = document.querySelector("#content-header h2").textContent;

		// convert date string "Saturday, February 18, 2023" to "2023-02-18"
		const date = new Date(dateString).toISOString().slice(0, 10);

		return {
			title: title,
			contents: contentsClean,
			source: window.location.href,
			date,
		};
	});

	commemorations.push(reading);

	// get date of day + 1 in YYYY/MM/DD format
	const nextDay = new Date(day);
	nextDay.setDate(nextDay.getDate() + 1);
	const nextDayYear = nextDay.getFullYear();
	const nextDayMonth = nextDay.getMonth() + 1;
	const nextDayDay = nextDay.getDate();
	const nextDayString = `${nextDayYear}/${nextDayMonth}/${nextDayDay}`;

	// if we've scraped 7 days, stop
	// if (counter === 0) {
	// 	return commemorations;
	// }

	// if year is the next year, stop
	if (nextDayYear === new Date(day).getFullYear() + 1) {
		return commemorations;
	}

	return await scrapeCommemorationsForDay(page, commemorations, nextDayString, counter + 1);
};

const scrapeCommemorations = async (startDayString, year) => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	const readings = await getCurrentReadings(`commemorations.${year}.json`);

	const newReadings = await scrapeCommemorationsForDay(page, readings.readings, startDayString);

	saveNewReadings(`commemorations.${year}.json`, readings, newReadings);

	await browser.close();
};

export default scrapeCommemorations;
