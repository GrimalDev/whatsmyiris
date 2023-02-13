import express from "express";
import pullExcelData from "../app/excelCalendarData.js";
import extractDayInfos, {teams} from "../app/calendarHandle.js";
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', {
      date: getDate(),
      teams: teams
  });
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