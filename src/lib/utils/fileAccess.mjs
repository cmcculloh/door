import { saveToS3, getFromS3 } from "./aws.mjs";
import fs from "fs";

const getCurrentReadings = async (file) => {
	let readings = {};
	try {
		// const fileData = fs.readFileSync(file, "utf8");
		const fileData = await getFromS3("dooreadings", file);
		readings = JSON.parse(fileData);
	} catch (e) {
		console.log("error reading file", e);
	}
	if (!readings.readings) {
		readings.readings = [];
	}
	return readings;
};

const saveNewReadings = async (file, readings, newReadings) => {
	// only saveToS3 if there are new readings
	if (newReadings.length > 0) {
		readings.readings = [...newReadings, ...readings.readings];
		readings.lastUpdated = new Date();

		// fs.writeFileSync(file, JSON.stringify(readings, null, "\t"));
		saveToS3("dooreadings", file, JSON.stringify(readings, null, "\t"));
	}
};

export { getCurrentReadings, saveNewReadings };
