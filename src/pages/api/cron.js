import { scrapeBlogsAndNews } from "../../lib/scrapeReadings.mjs";

export default function handler(req, res) {
	scrapeBlogsAndNews();
	res.status(200).end("Hello Cron!");
}
