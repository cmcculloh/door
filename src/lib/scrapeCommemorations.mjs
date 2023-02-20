import { chromium } from "playwright";
import { saveToS3, getFromS3 } from "./aws.mjs";

const scrapeCommemorationsForDay = async (page, commemorations = [], day, counter = 0) => {
	await page.goto(`https://www.oca.org/readings/daily/${day}`);

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
	// if (counter === 7) {
	// 	return commemorations;
	// }

	// if year is the next year, stop
	if (nextDayYear === new Date(day).getFullYear() + 1) {
		return commemorations;
	}

	return await scrapeCommemorationsForDay(page, commemorations, nextDayString, counter + 1);
};

const scrapeCommemorations = async (todayString, year) => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	// get current readings from readings.json
	let readings;
	try {
		// const fileData = fs.readFileSync(`commemorations.${year}.json`, "utf8");
		const fileData = await getFromS3("dooreadings", `commemorations.${year}.json`);
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}

	readings.readings = await scrapeCommemorationsForDay(page, readings.readings, todayString);

	// fs.writeFileSync(`commemorations.${year}.json`, JSON.stringify(readings, null, "\t"));
	saveToS3("dooreadings", `commemorations.${year}.json`, JSON.stringify(readings, null, "\t"));

	await browser.close();
};

export default scrapeCommemorations;
