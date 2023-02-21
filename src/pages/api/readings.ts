// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getFromS3 } from "../../lib/utils/aws.mjs/index.js";

type Reading = {
	title: string;
	date: string;
	contents: string;
	source: string;
};

const noReadings = {
	readings: [
		{
			title: "No Readings",
			date: "No Readings",
			contents: "No Readings",
			source: "No Readings",
		},
	],
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

const getReadingsForDay = async (file: string) => {
	const currentYear = new Date().getFullYear();

	// get oca readings from "../../lib/commemorations.json"
	// const commemorations = require(`../../lib/commemorations.${currentYear}.json`);
	const fileData =
		(await getFromS3("dooreadings", `${file}.${currentYear}.json`)) ||
		JSON.stringify(noReadings);
	const allReadings = JSON.parse(fileData);

	const filteredReadings = getReadingsMatchingDate(allReadings.readings);

	// return allReadings whose date matches today's date
	return filteredReadings;
};

const getNewestUnread = async (file: string) => {
	// get only the latest post from "../../lib/ocanews.json"
	// const ocaNews = require(`../../lib/ocanews.json`) as { readings: Reading[] };
	const fileData = (await getFromS3("dooreadings", `${file}.json`)) || JSON.stringify(noReadings);
	const ocaNews = JSON.parse(fileData);

	// return most recent unread post
	return [getMostRecentUnread(ocaNews.readings, "")];
};

const getTodaysReadings = async () => {
	const todaysReadings = await Promise.all([
		getReadingsForDay("commemorations"),
		getReadingsForDay("readings"),
		getReadingsForDay("saints"),
		getNewestUnread("ocanews"),
		getNewestUnread("nootherfoundation"),
	]).then((results) => {
		const readings = results.reduce((acc, curr) => [...acc, ...curr], []);
		return { readings };
	});

	return todaysReadings;
};

type ReadingsData = {
	readings: {
		title: string;
		date: string;
		contents: string;
		source: string;
	}[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ReadingsData>) {
	const todaysReadings = await getTodaysReadings();

	res.status(200).json(todaysReadings);
}

