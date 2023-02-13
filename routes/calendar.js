import express from "express";
import pullExcelData from "../app/excelCalendarData.js";
import extractDayInfos, { teams } from "../app/calendarHandle.js";
import dd from "dump-die";
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    //TODO: respond json between dates (start, end) in the get request

    const excelCalendarPath = "/Users/thehiddengeek/WebstormProjects/whatsmyiris/src/calendar/calendar-main.xlsx";

    //if calendar get request ask for the teams, return the teams
    if (req.query.teams === "") {
        return res.json({ teams: teams });
    }

    // console.log('--------------------------\nDATA NOT LIVE YET!!!!!!!!!!!!!!!!!!!!!!!!!!!\n--------------------------');
    // res.json(await extractDayInfos(excelCalendarPath));


    // await excel handling with error handling
    try {
        await pullExcelData(excelCalendarPath);
        res.json(await extractDayInfos(excelCalendarPath));
    } catch (error) {
        console.log(error);
        res.json({error: 'Could not get calendar data.'});
    }
});

//get current date
async function getDate() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("fr-FR", options);
}

export default router;