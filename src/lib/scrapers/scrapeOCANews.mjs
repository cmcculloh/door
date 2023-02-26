import scrapeNewReadings from "./universalScraper.mjs";

const composeScrapeNews = () => {
	const pageScrapeOpts = {
		titleSelector: ".categories header h1",
		dateSelector: ".categories header time",
		contentsSelector: "#main-col-contents article > p, #main-col-contents article > figure",
		type: "news",
		source: "oca",
	};

	const opts = {
		linksSelector: "#main-col-contents > .categories > article a",
		nextSelector: "#main-col-contents .pagination .next-button",
		url: `https://www.oca.org/news`,
	};

	console.log('scraping news from "oca"');

	return () => scrapeNewReadings(opts, pageScrapeOpts);
};

export default composeScrapeNews();
