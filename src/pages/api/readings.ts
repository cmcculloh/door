import type { NextApiRequest, NextApiResponse } from "next";
import { getReadingsForDate, getNewestReadingForSourceAndType } from "../../lib/utils/db.mjs";

type Reading = {
	title: string;
	date: string;
	contents: string;
	source: string;
};

type ReadingsData = {
	readings: Reading[];
};

const sources = [
	{ source: "nootherfoundation", type: "blog" },
	// { source: "morningoffering", type: "blog" },
	{ source: "oca", type: "news" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ReadingsData>) {
	const todaysReadings = (await getReadingsForDate(new Date())) as Reading[];
	const newestReadings = await Promise.all(
		sources.map(
			async ({ source, type }) =>
				(await getNewestReadingForSourceAndType(source, type)) || {
					title: `No Readings for ${source}, ${type}`,
					date: new Date(),
					contents: "No Readings",
					source,
				}
		)
	);
	const readings = { readings: [...todaysReadings, ...newestReadings] };

	res.status(200).json(readings);
}
