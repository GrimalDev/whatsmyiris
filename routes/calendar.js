import express from "express";
import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
//dotenv config
import dotenv from "dotenv";
import {teams} from "../app/calendarHandle.js";
import getCalendarJSON from "../app/calendarController.js";
import {getUserById} from "../app/userController.js";
import bcrypt from "bcrypt";

const router = express.Router();

dotenv.config();

/* GET home page. */
router.get('/', async function (req, res, next) {
    //TODO: respond json between dates (start, end) in the get request

    //get the root folder
    //Get the absolute path of th src folder
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    //if calendar get request ask for the teams, return the teams
    if (req.query.teams === "") {
        return res.json({ teams: teams });
    }

    // console.log('--------------------------\nDATA NOT LIVE YET!!!!!!!!!!!!!!!!!!!!!!!!!!!\n--------------------------');
    // res.json(await extractDayInfos(excelCalendarPath));

    try {

        //get the calendar json ('src/calendar/calendar.json')
        const calendarJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/calendar/calendar.json'), 'utf8'));

        let calendarReturned = {};

        //return the calendar as json between the dates in the get request

        //calendarJSON null protector
        if (calendarJSON === null) { return res.json({error: 'Could not get calendar data.'}); }

        if (req.query.start && req.query.end) {
            const start = new Date(req.query.start);
            const end = new Date(req.query.end);

            calendarReturned = await calendarJSON.filter(event => {
                const eventDate = new Date(event.start);
                return eventDate >= start && eventDate <= end;
            });
        } else {
            calendarReturned = calendarJSON;
        }

        //TODO: filter events based on the teams in the session
        //verify if user connected
        if (req.cookies['uid']) {
            //get the user
            const user = await getUserById(req.cookies['uid']);

            if (user) {
                //if user is not admin, filter events based on the teams in the session
                //verify password with cookie hash
                if (user.role !== 'admin') {
                    calendarReturned = await calendarReturned.filter(event => {
                        return user.role.includes(event.team);
                    });
                }
            }
        }

        res.json(calendarReturned)

    } catch (error) {
        console.error(error);
        await getCalendarJSON();
        res.json({error: 'Could not get calendar data.'});
    }
});

export default router;