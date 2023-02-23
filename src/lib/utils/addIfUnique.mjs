// https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
const isUnique = (candidate, current) =>
	current.title === candidate.title && current.date.getTime() === candidate.date.getTime();

const addIfUnique = (readings, reading) => {
	if (!readings.find((r) => isUnique(r, reading))) {
		console.log("adding", reading.title, "to readings");
		readings.push(reading);
	} else {
		console.log("existing reading found", reading.title, reading.date);
	}

	return readings;
};

export default addIfUnique;
