import { chromium } from "playwright";
import fs from "fs";

const scrapeSaintsForDay = async (page, readings = [], day, counter = 0) => {
	await page.goto(`https://www.oca.org/saints/lives/${day}`);

	const links = await page.$$eval(
		"#main-col-contents > section > article .content a:first-child",
		(as) => as.map((a) => a.href)
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
			const title = document.querySelector("#content-header h1").textContent;
			// strip special characters from title
			const titleClean = title.replace(/[^a-zA-Z0-9\:\(\)\[\]\- ]/g, "");
			// strip leading double spaces from title
			const titleCleaner = titleClean.replace(/  /, "");

			const articles = [];

			const imgLink = document.querySelector(
				"#main-col-contents article > figure > span > a"
			);
			if (imgLink) {
				articles.push(`<p>${imgLink.innerHTML}</p>`);
			}

			document.querySelectorAll("#main-col-contents article > p").forEach((p) => {
				articles.push(`<p>${p.innerHTML.replace(/[\n\t]/g, "")}</p>`);
			});

			const contents = articles.join("");

			return {
				title: titleCleaner,
				contents,
				source: window.location.href,
			};
		});
		reading.date = day;

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
	// if (counter === 0) {
	// 	return readings;
	// }

	// if year is the next year, stop
	if (nextDayYear === new Date(day).getFullYear() + 1) {
		return readings;
	}

	return await scrapeSaintsForDay(page, readings, nextDayString, counter + 1);
};

const scrapeSaints = async (todayString, year) => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	// get current readings from readings.json
	let readings;
	try {
		// const fileData = fs.readFileSync(`saints.${year}.json`, "utf8");
		const fileData = await getFromS3("dooreadings", `saints.${year}.json`);
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}

	readings.readings = await scrapeSaintsForDay(page, readings.readings, todayString);

	// fs.writeFileSync(`saints.${year}.json`, JSON.stringify(readings, null, "\t"));
	saveToS3("dooreadings", `saints.${year}.json`, JSON.stringify(readings, null, "\t"));

	await browser.close();
};

export default scrapeSaints;
