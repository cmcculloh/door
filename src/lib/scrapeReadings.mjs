// fix SyntaxError: Cannot use import statement outside a module
// https://stackoverflow.com/questions/65097591/node-js-syntaxerror-cannot-use-import-statement-outside-a-module

import scrapeReadings from "./scrapeOCADailyReadings.mjs";
import scrapeCommemorations from "./scrapeCommemorations.mjs";
import scrapeSaints from "./scrapeSaints.mjs";
import scrapeOCANews from "./scrapeOCANews.mjs";

// const today = new Date();
// const year = today.getFullYear();
// const month = today.getMonth() + 1;
// const day = today.getDate();

// today in YYYY/MM/DD format
// const todayString = `${year}/${month}/${day}`;
const todayString="2024/0/1";

scrapeReadings(todayString, 2024);
scrapeCommemorations(todayString, 2024);
scrapeSaints(todayString, 2024);
scrapeOCANews();
