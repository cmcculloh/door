import scrapeNewReadings from "./universalScraper.mjs";

const composeScrapeReadings = () => {
	const pageScrapeOpts = {
		titleSelector: "#main-col-contents > section > article > h2",
		dateSelector: "#content-header > h2",
		contentsSelector: "article dl.reading",
		type: "reading",
		source: "oca",
	};

	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const day = today.getDate();

	// today in YYYY/MM/DD format
	// const todayString = `${year}/${month}/${day}`;
	const todayString = "2023/03/18";

	const opts = {
		linksSelector: "#main-col-contents > section > ul > li > a",
		nextSelector: "footer.article-footer > .next > a",
		url: `https://www.oca.org/readings/daily/${todayString}`,
		limit: 293,
		ignoreExisting: true,
	};

	console.log(
		`scraping daily readings from "oca" starting on ${todayString} for ${opts.limit} days`
	);

	return () => scrapeNewReadings(opts, pageScrapeOpts);
};

export default composeScrapeReadings();

// import { chromium } from "playwright";
// import { saveReadings, getReadingsBySourceAndType } from "../utils/db.mjs";
// import throttle from "../utils/throttle.mjs";
// import addIfUnique from "../utils/addIfUnique.mjs";
// import getNextDay from "../utils/getNextDay.mjs";

// const scrapeReadingsForDay = async (page, readings = [], day, counter = 0) => {
// 	const url = `https://www.oca.org/readings/daily/${day}`;
// 	console.log("scraping", url);
// 	await page.goto(url);

// 	const links = await page.$$eval("#main-col-contents > section > ul a", (as) =>
// 		as.map((a) => a.href)
// 	);

// 	console.log("links", links);

// 	for (const link of links) {
// 		await throttle(page);

// 		// follow link
// 		await page.goto(link);

// 		// scrape data
// 		const reading = await page.evaluate(() => {
// 			const title = document.querySelector("article > h2").textContent;
// 			// strip special characters from title
// 			const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
// 			// strip leading double spaces from title
// 			const titleCleaner = titleClean.replace(/  /, "");

// 			const contents = `<dl class="reading">${
// 				document.querySelector("article dl.reading").innerHTML
// 			}</dl>`;
// 			// strip newline and tab charagers from contents
// 			const contentsClean = contents.replace(/[\n\t]/g, "");

// 			const dateString = document.querySelector("#content-header h2").textContent;

// 			return {
// 				title: titleCleaner,
// 				contents: contentsClean,
// 				url: window.location.href,
// 				date: new Date(dateString),
// 				type: "reading",
// 				source: "oca",
// 				scraped: new Date(),
// 			};
// 		});

// 		addIfUnique(readings, reading);
// 	}

// 	const { nextDayString, nextDayYear } = getNextDay(day);

// 	// if we've scraped 7 days, stop
// 	if (counter === 1) {
// 		return readings;
// 	}

// 	// if year is the next year, stop
// 	if (nextDayYear === new Date(day).getFullYear() + 1) {
// 		return readings;
// 	}

// 	return await scrapeReadingsForDay(page, readings, nextDayString, counter + 1);
// };

// const scrapeReadings = async (startDayString, year) => {
// 	const browser = await chromium.launch({ headless: false });
// 	const page = await browser.newPage();

// 	const readings = await getReadingsBySourceAndType("oca", "reading");

// 	const newReadings = await scrapeReadingsForDay(page, readings, startDayString);

// 	saveReadings(newReadings);

// 	await browser.close();
// };

// export default scrapeReadings;
