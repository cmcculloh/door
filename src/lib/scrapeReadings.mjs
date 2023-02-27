// fix SyntaxError: Cannot use import statement outside a module
// https://stackoverflow.com/questions/65097591/node-js-syntaxerror-cannot-use-import-statement-outside-a-module

// import scrapeReadings from "./scrapers/scrapeOCADailyReadings.mjs";
// import scrapeCommemorations from "./scrapers/scrapeCommemorations.mjs";
import scrapeSaints from "./scrapers/scrapeSaints.mjs";
// import scrapeOCANews from "./scrapers/scrapeOCANews.mjs";
// import scrapeFarley from "./scrapers/scrapeFarley.mjs";
// import scrapeMorningOffering from "./scrapers/scrapeMorningOffering.mjs";

// const today = new Date();
// const year = today.getFullYear();
// const month = today.getMonth() + 1;
// const day = today.getDate();

// today in YYYY/MM/DD format
// const todayString = `${year}/${month}/${day}`;
const todayString = "2023/01/01";

// scrapeReadings();
// scrapeCommemorations(todayString);
scrapeSaints();
// scrapeOCANews();
// scrapeFarley();
// scrapeMorningOffering();