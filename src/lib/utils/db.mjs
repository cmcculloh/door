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
	getReadingsBySourceAndType,
	getReadings,
	getReading,
	updateReading,
	deleteReading,
};
