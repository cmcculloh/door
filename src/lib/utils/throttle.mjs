const throttle = async (page) => {
	// wait for a random number of seconds between 1 and 26
	const waitTime = Math.floor(Math.random() * 3) + 1;
	console.log("waiting", waitTime, "seconds");
	await page.waitForTimeout(waitTime * 1000);
	return;
};

export default throttle;
