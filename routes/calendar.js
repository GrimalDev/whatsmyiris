import express from "express";
import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
const router = express.Router();

//dotenv config
import dotenv from "dotenv";
dotenv.config();

/* GET home page. */
router.get('/', async function (req, res, next) {
    //TODO: respond json between dates (start, end) in the get request

    //get the root folder
    //Get the absolute path of th src folder
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    //get the path to the excel file
    const excelCalendarPath = path.join(__dirname, '../src/calendar/main-calendar.xlsx');

    //if calendar get request ask for the teams, return the teams
    if (req.query.teams === "") {
        return res.json({ teams: teams });
    }

    // console.log('--------------------------\nDATA NOT LIVE YET!!!!!!!!!!!!!!!!!!!!!!!!!!!\n--------------------------');
    // res.json(await extractDayInfos(excelCalendarPath));

    try {

        //get the calendar json ('src/calendar/calendar.json')
        const calendarJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/calendar/calendar.json'), 'utf8'));

        //return the calendar as json between the dates in the get request

        //calendarJSON null protector
        if (calendarJSON === null) { return res.json({error: 'Could not get calendar data.'}); }

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
    } catch (error) {
        console.error(error);
        res.json({error: 'Could not get calendar data.'});
    }
});

export default router;