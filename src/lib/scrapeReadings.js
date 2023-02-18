// using playwright, scrape a page, follow the links to other pages, scrape those pages, and save the data to a file
const fs = require("fs");
const { chromium } = require("playwright");

const scrapeReadings = async () => {
	const browser = await chromium.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto("https://www.oca.org/readings");

	const links = await page.$$eval("#main-col-contents > section > ul a", (as) =>
		as.map((a) => a.href)
	);

	console.log("links", links);

	// get current readings from readings.json
	let readings = [];
	try {
		const fileData = fs.readFileSync("readings.json", "utf8");
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}

	for (const link of links) {
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

	fs.writeFileSync("readings.json", JSON.stringify(readings, null, "\t"));

	await browser.close();
};

scrapeReadings();

// const puppeteer = require("puppeteer");
// const fs = require("fs");

// const scrapeReading = async (url, page) => {
// 	console.log("scrape", url);
// 	await page.goto(url, { waitUntil: "networkidle2" });

// 	console.log("went to", url);

// 	const title = await page.$eval("#main-col-contents h2", (h1) => h1.textContent);
// 	const date = await page.$eval("#main-col-contents #content-header h2", (h2) => h2.textContent);
// 	const contents = await page.$eval(
// 		"#main-col-contents article .reading",
// 		(dl) => dl.textContent
// 	);
// 	const source = url;

// 	const data = {
// 		title,
// 		date,
// 		contents,
// 		source,
// 	};

// 	fs.writeFile("readings.json", JSON.stringify(data, null, 4), (err) => {
// 		if (err) {
// 			console.error(err);
// 			return;
// 		}
// 		console.log("File successfully written!");
// 	});
// };

// const baseURL = "https://www.oca.org/readings";

// const scrapeReadings = async () => {
// 	const browser = await puppeteer.launch({ headless: false });
// 	const page = await browser.newPage();
// 	await page.goto(baseURL);

// 	const readingLinks = await page.$("#main-col-contents section ul");
// 	const links = await readingLinks.$$eval("a", (as) => as.map((a) => a.href));

// 	const readings = links.map(async (link) => await scrapeReading(link, page));

// 	browser.close();
// };

// scrapeReadings();

// // Path: src/lib/readings.ts
// // Compare this snippet from src/pages/api/readings.ts:
// // // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// // import type { NextApiRequest, NextApiResponse } from "next";
// //
// // import readings from "../../lib/readings";
// //
// // type ReadingsData = {
// //     readings: {
// //         title: string;
// //         date: string;
// //         contents: string;
// //         source: string;
// //     }[];
// // };
// //
// // export default function handler(req: NextApiRequest, res: NextApiResponse<ReadingsData>) {
// // 	res.status(200).json(readings);
// // }
// //
// // const readings = require("./readings.json");

// // export default readings;
