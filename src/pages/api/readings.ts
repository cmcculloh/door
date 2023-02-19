// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { read } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

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
