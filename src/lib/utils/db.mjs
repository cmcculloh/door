import prisma from "../prisma.mjs";

const saveReading = async (reading) => {
	const result = await prisma.readings.create({
		data: reading,
	});

	return result;
};

const saveReadings = async (readings) => {
	const result = await prisma.readings.createMany({
		data: readings,
		skipDuplicates: true,
	});

	return result;
};

const getReadingsBySourceAndType = async (source, type) => {
	const result = await prisma.readings.findMany({
		where: {
			source: source,
			type: type,
		},
		orderBy: {
			date: "desc",
		},
	});

	return result;
};

const getReadingsForDate = async (date) => {
	// get date in YYYY-MM-DD format, add a day
	const datePlusOne = new Date(date);
	datePlusOne.setDate(datePlusOne.getDate() + 1);
	const dateFilter = {
		gte: new Date(date.toISOString().split("T")[0]),
		lt: new Date(datePlusOne.toISOString().split("T")[0]),
	};

	const commemorations = await prisma.readings.findFirst({
		where: {
			source: "oca",
			type: "commemoration",
			date: dateFilter,
		},
	});

	const readings = await prisma.readings.findMany({
		where: {
			source: "oca",
			type: "reading",
			date: dateFilter,
		},
		orderBy: {
			scraped: "asc",
		},
	});

	const saints = await prisma.readings.findMany({
		where: {
			source: "oca",
			type: "saints",
			date: dateFilter,
		},
		orderBy: {
			scraped: "asc",
		},
	});

	return [commemorations, ...readings, ...saints];
};

// Get newest reading for each source and type
const getNewestReadingForSourceAndType = async (source, type) => {
	const result = await prisma.readings.findFirst({
		where: {
			source: source,
			type: type,
		},
		orderBy: {
			date: "desc",
		},
	});

	return result;
};

const getReadings = async (source) => {
	console.log("source", source);
	const result = await prisma.readings.findMany({
		where: {
			source: source,
		},
		orderBy: {
			date: "desc",
		},
	});

	return result;
};

const getReading = async (id) => {
	const result = await prisma.readings.findUnique({
		where: {
			id: parseInt(id),
		},
	});

	return result;
};

const updateReading = async (id, reading) => {
	const result = await prisma.readings.update({
		where: {
			id: parseInt(id),
		},
		data: reading,
	});

	return result;
};

const deleteReading = async (id) => {
	const result = await prisma.readings.delete({
		where: {
			id: parseInt(id),
		},
	});

	return result;
};

export {
	saveReadings,
	saveReading,
	getReadingsForDate,
	getNewestReadingForSourceAndType,
	getReadingsBySourceAndType,
	getReadings,
	getReading,
	updateReading,
	deleteReading,
};
