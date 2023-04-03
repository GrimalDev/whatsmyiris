import fs from "fs";

import pullExcelData from "./excelCalendarData.js";
import extractDayInfos from "./calendarHandle.js";

export default async function getCalendarJSON() {
    const calendarExcelPath = 'src/calendar/main-calendar.xlsx';
    const calendarJSONPath = 'src/calendar/calendar.json';

    await pullExcelData(calendarExcelPath);

    await new Promise(r => setTimeout(r, 4000));

    //wait for the excel file to be downloaded
    while (!fs.existsSync(calendarExcelPath)) {
        await new Promise(r => setTimeout(r, 100));
    }

    const calendarJSON = await extractDayInfos(calendarExcelPath);
    //write the calendarJSON to a file

    //If the data is null, empty or undefined, return
    if (calendarJSON === null || calendarJSON === "") { return; }

    try {
        fs.writeFileSync(calendarJSONPath, JSON.stringify(calendarJSON));
        console.log('Calendar JSON file created');
    } catch (error) {
        console.error(error);
    }
}