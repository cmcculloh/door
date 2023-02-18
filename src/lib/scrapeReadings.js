// using playwright, scrape a page, follow the links to other pages, scrape those pages, and save the data to a file
const fs = require("fs");
const { chromium } = require("playwright");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();

// today in YYYY/MM/DD format
const todayString = `${year}/${month}/${day}`;

const scrapeReadingsForDay = async (page, readings = [], day = todayString, counter = 0) => {
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
	if (nextDayYear === year + 1) {
		return readings;
	}

	return await scrapeReadingsForDay(page, readings, nextDayString, counter + 1);
};

const scrapeReadings = async () => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	// get current readings from readings.json
	let readings;
	try {
		const fileData = fs.readFileSync(`readings.${year}.json`, "utf8");
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}

	readings.readings = await scrapeReadingsForDay(page, readings.readings);

	fs.writeFileSync(`readings.${year}.json`, JSON.stringify(readings, null, "\t"));

	await browser.close();
};

// scrapeReadings();

// document.querySelector("#main-col-contents > section > p").innerHTML

const scrapeCommemorationsForDay = async (
	page,
	commemorations = [],
	day = todayString,
	counter = 0
) => {
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
	if (nextDayYear === year + 1) {
		return commemorations;
	}

	return await scrapeCommemorationsForDay(page, commemorations, nextDayString, counter + 1);
};

const scrapeCommemorations = async () => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	// get current readings from readings.json
	let readings;
	try {
		const fileData = fs.readFileSync(`commemorations.${year}.json`, "utf8");
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}

	readings.readings = await scrapeCommemorationsForDay(page, readings.readings);

	fs.writeFileSync(`commemorations.${year}.json`, JSON.stringify(readings, null, "\t"));

	await browser.close();
};

scrapeCommemorations();
