import express from "express";
import pullExcelData from "../app/excelCalendarData.js";
import extractDayInfos, { teams } from "../app/calendarHandle.js";
import {fileURLToPath} from "url";
import path from "path";
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    //TODO: respond json between dates (start, end) in the get request

    //get the root folder
    //Get the absolute path of th src folder
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    //get the path to the excel file
    const excelCalendarPath = path.join(__dirname, '../src/calendar/main-calendar.xlsx');
    const configPath = path.join(__dirname, '../app/config/private.json');

    //if calendar get request ask for the teams, return the teams
    if (req.query.teams === "") {
        return res.json({ teams: teams });
    }

    // console.log('--------------------------\nDATA NOT LIVE YET!!!!!!!!!!!!!!!!!!!!!!!!!!!\n--------------------------');
    // res.json(await extractDayInfos(excelCalendarPath));


    // await excel handling with error handling
    try {
        await pullExcelData(excelCalendarPath, configPath);
        //time out to wait for the file to be downloaded
        setTimeout(async () => {
            const calendarJSON = await extractDayInfos(excelCalendarPath);
            //return the calendar as json between the dates in the get request
            if (req.query.start && req.query.end) {
                const start = new Date(req.query.start);
                const end = new Date(req.query.end);
                const filteredCalendar = calendarJSON.filter(event => {
                    const eventDate = new Date(event.start);
                    return eventDate >= start && eventDate <= end;
                });
                res.json(filteredCalendar);
            } else {
                res.json(calendarJSON);
            }
        }, 1000);
    } catch (error) {
        console.log(error);
        res.json({error: 'Could not get calendar data.'});
    }
});

export default router;