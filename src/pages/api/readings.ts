// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { read } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

type Reading = {
	title: string;
	date: string;
	contents: string;
	source: string;
};

const getReadingsMatchingDate = (readings: any, date: Date = new Date()) =>
	readings.filter((reading: any) => {
		const readingDate = new Date(reading.date);

		// UTCDate is used to compare dates because the date is stored without time which means that it will match tomorrow instead of today in the afternoon/evening
		return (
			readingDate.getUTCDate() === date.getDate() &&
			readingDate.getMonth() === date.getMonth() &&
			readingDate.getFullYear() === date.getFullYear()
		);
	});

// loop through the user's read data and return the most recent unread post
const getMostRecentUnread = (readings: Reading[], lastRead: string) =>
	readings.find((reading: any) => reading.title !== lastRead);

// current year
const currentYear = new Date().getFullYear();

// get oca readings from "../../lib/readings.json"
const ocaScriptureReadings = require(`../../lib/readings.${currentYear}.json`);

// get ocaScriptureReadings whose date matches today's date
const todaysReadings = {
	readings: getReadingsMatchingDate(ocaScriptureReadings.readings),
};

// get oca readings from "../../lib/commemorations.json"
const commemorations = require(`../../lib/commemorations.${currentYear}.json`);

// get commemorations whose date matches today's date
todaysReadings.readings.unshift(...getReadingsMatchingDate(commemorations.readings));

// get ocaSaintsReadings from "../../lib/saints.json"
const ocaSaintsReadings = require(`../../lib/saints.${currentYear}.json`);

todaysReadings.readings.push(...getReadingsMatchingDate(ocaSaintsReadings.readings));

// get only the latest post from "../../lib/ocanews.json"
const ocaNews = require(`../../lib/ocanews.json`) as { readings: Reading[] };

todaysReadings.readings.push(getMostRecentUnread(ocaNews.readings, ""));

type ReadingsData = {
	readings: {
		title: string;
		date: string;
		contents: string;
		source: string;
	}[];
};

// console.log("todaysReadings", todaysReadings);
// const todaysDate = new Date();

// console.log("todaysDate", todaysDate.getDate());

export default function handler(req: NextApiRequest, res: NextApiResponse<ReadingsData>) {
	res.status(200).json(todaysReadings);
}
