const getNextDay = (day) => {
	// get date of day + 1 in YYYY/MM/DD format
	const nextDay = new Date(day);
	nextDay.setDate(nextDay.getDate() + 1);
	const nextDayYear = nextDay.getFullYear();
	const nextDayMonth = nextDay.getMonth() + 1;
	const nextDayDay = nextDay.getDate();
	const nextDayString = `${nextDayYear}/${nextDayMonth}/${nextDayDay}`;

	return { nextDayString, nextDayYear };
};

export default getNextDay;
