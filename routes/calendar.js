import express from "express";
import pullExcelData from "../app/excelCalendarData.js";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    pullExcelData()
        .then(out => res.json({
            message: 'Excel calendar data pulled successfully',
            data: out
        }))
        .catch(err => res.json({
            message: 'Error pulling Excel calendar data',
            data: err
        }));
});

export default router;