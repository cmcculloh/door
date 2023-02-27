import scrapeNewReadings from "./universalScraper.mjs";

const composeScrapeSaints = () => {
	const pageScrapeOpts = {
		titleSelector: "#content-header h1",
		dateSelector: "#content-header time a",
		contentsSelector: "#main-col-contents article > p",
		imgSelector: "#main-col-contents article > figure > span > a",
		type: "saints",
		source: "oca",
		forceYear: 2023,
	};

	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const day = today.getDate();

	// today in YYYY/MM/DD format
	// const todayString = `${year}/${month}/${day}`;
	const todayString = "2023/03/01";

	const opts = {
		linksSelector: "#main-col-contents > section > article .content a:first-child",
		nextSelector: "#main-col-contents footer .next a",
		url: `https://www.oca.org/saints/lives/${todayString}`,
		limit: 306,
		ignoreExisting: true,
	};

	console.log(`scraping saints from "oca" starting on ${todayString} for ${opts.limit} days`);

	return () => scrapeNewReadings(opts, pageScrapeOpts);
};

export default composeScrapeSaints();

// import { chromium } from "playwright";
// import { saveNewReadings, getCurrentReadings } from "../utils/fileAccess.mjs";

// const scrapeSaintsForDay = async (page, readings = [], day, counter = 0) => {
// 	const url = `https://www.oca.org/saints/lives/${day}`;
// 	console.log("scraping", url);
// 	await page.goto(url);

// 	const links = await page.$$eval(
// 		"#main-col-contents > section > article .content a:first-child",
// 		(as) => as.map((a) => a.href)
// 	);

// 	console.log("links", links);

// 	for (const link of links) {
// 		// wait for a random number of seconds between 1 and 26
// 		const waitTime = Math.floor(Math.random() * 3) + 1;
// 		console.log("waiting", waitTime, "seconds");
// 		await page.waitForTimeout(waitTime * 1000);

// 		// follow link
// 		await page.goto(link);

// 		// scrape data
// 		const reading = await page.evaluate(() => {
// 			const title = document.querySelector("#content-header h1").textContent;
// 			// strip special characters from title
// 			const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
// 			// strip leading double spaces from title
// 			const titleCleaner = titleClean.replace(/  /, "");

// 			const articles = [];

// 			const imgLink = document.querySelector(
// 				"#main-col-contents article > figure > span > a"
// 			);
// 			if (imgLink) {
// 				articles.push(`<p>${imgLink.innerHTML}</p>`);
// 			}

// 			document.querySelectorAll("#main-col-contents article > p").forEach((p) => {
// 				articles.push(`<p>${p.innerHTML.replace(/[\n\t]/g, "")}</p>`);
// 			});

// 			const contents = articles.join("");

// 			return {
// 				title: titleCleaner,
// 				contents,
// 				source: window.location.href,
// 			};
// 		});
// 		reading.date = day;

// 		// save data
// 		readings.push(reading);
// 	}

// 	// get date of day + 1 in YYYY/MM/DD format
// 	const nextDay = new Date(day);
// 	nextDay.setDate(nextDay.getDate() + 1);
// 	const nextDayYear = nextDay.getFullYear();
// 	const nextDayMonth = nextDay.getMonth() + 1;
// 	const nextDayDay = nextDay.getDate();
// 	const nextDayString = `${nextDayYear}/${nextDayMonth}/${nextDayDay}`;

// 	// if we've scraped 7 days, stop
// 	// if (counter === 0) {
// 	// 	return readings;
// 	// }

// 	// if year is the next year, stop
// 	if (nextDayYear === new Date(day).getFullYear() + 1) {
// 		return readings;
// 	}

// 	return await scrapeSaintsForDay(page, readings, nextDayString, counter + 1);
// };

// const scrapeSaints = async (startDayString, year) => {
// 	const browser = await chromium.launch({ headless: false });
// 	const page = await browser.newPage();

// 	const readings = await getReadingsBySourceAndType("oca", "saints");

// 	const newReadings = await scrapeSaintsForDay(page, readings.readings, startDayString);

// 	saveReadings(newReadings);

// 	await browser.close();
// };

// export default scrapeSaints;
