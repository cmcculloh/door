import { chromium } from "playwright";
import fs from "fs";

const scrapeReadingsForDay = async (page, readings = [], day, counter = 0) => {
	await page.goto(`https://www.oca.org/readings/daily/${day}`);

	const links = await page.$$eval("#main-col-contents > section > ul a", (as) =>
		as.map((a) => a.href)
	);

	console.log("links", links);

	for (const link of links) {
		// wait for a random number of seconds between 1 and 26
		const waitTime = Math.floor(Math.random() * 3) + 1;
		console.log("waiting", waitTime, "seconds");
		await page.waitForTimeout(waitTime * 1000);

		// follow link
		await page.goto(link);

		// scrape data
		const reading = await page.evaluate(() => {
			const title = document.querySelector("article > h2").textContent;
			// strip special characters from title
			const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
			// strip leading double spaces from title
			const titleCleaner = titleClean.replace(/  /, "");

			const contents = `<dl class="reading">${
				document.querySelector("article dl.reading").innerHTML
			}</dl>`;
			// strip newline and tab charagers from contents
			const contentsClean = contents.replace(/[\n\t]/g, "");

			const dateString = document.querySelector("#content-header h2").textContent;

			// convert date string "Saturday, February 18, 2023" to "2023-02-18"
			const date = new Date(dateString).toISOString().slice(0, 10);

			return {
				title: titleCleaner,
				contents: contentsClean,
				source: window.location.href,
				date,
			};
		});

		// save data
		readings.push(reading);
	}

	// get date of day + 1 in YYYY/MM/DD format
	const nextDay = new Date(day);
	nextDay.setDate(nextDay.getDate() + 1);
	const nextDayYear = nextDay.getFullYear();
	const nextDayMonth = nextDay.getMonth() + 1;
	const nextDayDay = nextDay.getDate();
	const nextDayString = `${nextDayYear}/${nextDayMonth}/${nextDayDay}`;

	// if we've scraped 7 days, stop
	// if (counter === 7) {
	// 	return readings;
	// }

	// if year is the next year, stop
	if (nextDayYear === new Date(day).getFullYear() + 1) {
		return readings;
	}

	return await scrapeReadingsForDay(page, readings, nextDayString, counter + 1);
};

const scrapeReadings = async (todayString, year) => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	// get current readings from readings.json
	let readings;
	try {
		// const fileData = fs.readFileSync(`readings.${year}.json`, "utf8");
		const fileData = await getFromS3("dooreadings", `readings.${year}.json`);
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}

	readings.readings = await scrapeReadingsForDay(page, readings.readings, todayString);

	// fs.writeFileSync(`readings.${year}.json`, JSON.stringify(readings, null, "\t"));
	saveToS3("dooreadings", `readings.${year}.json`, JSON.stringify(readings, null, "\t"));

	await browser.close();
};

export default scrapeReadings;
