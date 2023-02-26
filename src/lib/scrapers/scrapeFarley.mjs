import scrapeNewReadings from "./universalScraper.mjs";

const composeScrapeNews = () => {
	const pageScrapeOpts = {
		titleSelector: "#main > article > header > h1",
		dateSelector: "#main > article > header time.published",
		contentsSelector:
			".entry-content > p, .entry-content > ol, .entry-content > ul, .entry-content > figure",
		type: "blog",
		source: "nootherfoundation",
	};

	const opts = {
		linksSelector: "#main > article.post > header > h2 > a",
		nextSelector: "#main .pagination .pnav-next",
		url: `https://blogs.ancientfaith.com/nootherfoundation/`,
	};

	console.log('scraping news from "nootherfoundation"');

	return () => scrapeNewReadings(opts, pageScrapeOpts);
};

export default composeScrapeNews();
