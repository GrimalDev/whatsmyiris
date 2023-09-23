import Excel from 'exceljs';
import moment from 'moment';
import fs from "fs";

//Extract day informations out of the excel file
//There is an Excel that defines a calendar. It is organized in blocks. One block represents a day and 5 blocks in a line separated with a column is a working week, ignoring the weekends. Form example:
// first week: height is from line 5 to 20 and the days are the following: C to E, G to I, K to M, O to Q; S to U. The next week is then 2 lines under the first and has the same pattern.
// Days: the 4 first lines of a block (day) is the head, ignore that. The first column of a block is the team 1, the second is team 2 and the third the team 3. In each column, from the fifth line to the last of the block, describes the class the team has were each line is an hour from 9h to 19h.
//TODO: Make the code more generic, so it can be used if more teams are added and the teams columns change.
//TODO: Add notes via the upper cells of a day
export const teams = ['BTS1', 'BTS2-SISR', 'BTS2-SLAM'];
const teamColumns = ['C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'O', 'P', 'Q', 'S', 'T', 'U'];
const dateRow = 2; // row where the date is
const hourRow = 4; // start of the hours

export default async function extractDayInfos(filePath) {
    const workbook = await new Excel.Workbook();
    try {
        await workbook.xlsx.readFile(filePath);
    } catch (error) {
        console.error(error);
        return null;
    }
    const worksheet = await workbook.getWorksheet(workbook.worksheets[0].name);

    const events = [];
    const weeksStart = []; // array of the row numbers where the weeks start

    // set the weeksStarts array
    // A new week is if the first cell (top left) of the first day of the week is a cell
    // Where the top cell has only a bottom border and the left cell has only a right border
    for (let i = 0; i < worksheet.rowCount; i++) {
        let currentCell = worksheet.getRow(i).getCell(teamColumns[0]);

        //undefinded protector
        if (currentCell.value === undefined) { continue; }
        //null protector
        if (currentCell.value === null) { continue; }
        // empty protector
        try {
            if (currentCell.value.trim().length === 0) { continue; }
        } catch (e) {
            //replace the cell with the result of the formula
            currentCell.value = currentCell.value.result;
        }

        // if current cell has a date than it is a start of the week
        //check if date is in format 2023-09-11T00:00:00.000Z
        if (moment(currentCell.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()) {
            weeksStart.push(i-2);
        }
    }

    //TODO: Add all day events when text writent in the middle of the day
    //TODO: Add place in the event

    // iterate through the weeks
    for (let week = 0; week < weeksStart.length; week++) {
        const weekStart = weeksStart[week];

        //loop through the days of the week
        for (let day = 0; day < 5; day++) {
            const dayStart = teamColumns[day * 3];
            const startDateCell = worksheet.getRow(weekStart + dateRow).getCell(dayStart).value
            let startDate = moment(startDateCell, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
            if (!startDate.isValid()) { startDate = moment(startDateCell.result); }
            startDate = startDate.toDate();

            //loop throught the hours of the teams
            for (let team = 0; team < 3; team++) {
                const teamStart = teamColumns[day * 3 + team];
                let tmpEvent = {
                    title: ''
                }

                //loop through the hours of the day
                for (let hour = 0; hour < 12; hour++) {
                    const hourStart = weekStart + hourRow + hour;
                    const dayHour = hour + 8;
                    const currentCell = worksheet.getRow(hourStart).getCell(teamStart);

                    //if the cell is empty, continue
                    if (currentCell.value === undefined) { continue; }
                    //if null, continue
                    if (currentCell.value === null) { continue; }
                    //if empty, continue
                    if (currentCell.value.trim().length === 0) { continue; }

                    const eventStart = moment(startDate).add(dayHour, 'hours').toDate();
                    const eventEnd = moment(startDate).add(dayHour + 1, 'hours').toDate();

                    //prepare the id of the event
                    //The id of an event is the title with parenthesis removed and all spaces replaced by dashes, the team  and the start date in timestamp format all in lowercase, with no spaces and seperated by an underscore
                    //All special characters are replaced with equivalents in french in the title
                    let idEvent = currentCell.value.noSpecialsFR().replace(/[\(\)]/g, '')
                    idEvent = idEvent.replace(/ /g, '-')
                    idEvent = idEvent.toLowerCase() + '_' + teams[team] + '_' + eventStart.getTime();

                    // Store cell in temporary event to see if the next is the same
                    const newTmpEvent = {
                        id: idEvent,
                        title: currentCell.value,
                        start: eventStart,
                        end: eventEnd,
                        team: teams[team],
                        classNames: [ `team-${teams[team]}` ],
                        allDay: false
                    };

                    //detect holidays if title contains 'vacances' and create allday event
                    // if (currentCell.value.toLowerCase().includes('vacances')) {
                    //     newTmpEvent.allDay = true;
                    //     newTmpEvent.classNames.push('holiday');
                    //
                    //     //save the event
                    //     events.push(newTmpEvent);
                    //     continue;
                    // }

                    // If it is the same, add 1 hour to the end of the tmp event
                    // When the event is different, save the previous event and temporary store the new one and reset the temporary event
                    // If the cell is empty, save the previous event, reset the temporary event and skip this cell
                    if (tmpEvent.title === '') {//case of a new event
                        tmpEvent = newTmpEvent;
                    } else if (tmpEvent.title === currentCell.value) {//case of the same event
                        //set the end date to the next hour
                        tmpEvent.end.setHours(tmpEvent.end.getHours() + 1);
                    } else {
                        //save the previous event
                        events.push(tmpEvent);

                        //set the new temp event
                        tmpEvent = newTmpEvent;
                    }

                }
                //save the last event
                events.push(tmpEvent);
            }
        }
    }

    return events.filter(event => event.title.trim() !== '');
    // write the events to a JSON file
    // fs.writeFileSync('events.json', JSON.stringify(events));
}

String.prototype.noSpecialsFR = function() {
    const accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    const noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

    let str = this;
    for(let i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
}

//For tests, if parameter given then run the function
if (process.argv[2]) {
    const eventsObject = await extractDayInfos(process.argv[2]);
    // write the events to a JSON file
    fs.writeFileSync('/Users/thehiddengeek/WebstormProjects/whatsmyiris/src/calendar/calendar.json', JSON.stringify(eventsObject));
}