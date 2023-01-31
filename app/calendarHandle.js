import Excel from 'exceljs';
import dd from "dump-die";

//Extract day informations out of the excel file
//There is an Excel that defines a calendar. It is organized in blocks. One block represents a day and 5 blocks in a line separated with a column is a working week, ignoring the weekends. Form example:
// first week: height is from line 5 to 20 and the days are the following: C to E, G to I, K to M, O to Q; S to U. The next week is then 2 lines under the first and has the same pattern.
// Days: the 4 first lines of a block (day) is the head, ignore that. The first column of a block is the team 1, the second is team 2 and the third the team 3. In each column, from the fifth line to the last of the block, describes the class the team has were each line is an hour from 9h to 19h.

export default async function extractDayInfos() {
    const filePath = '../src/calendar/calendar-main.xlsx';
    const workbook = await new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = await workbook.getWorksheet(workbook.worksheets[0].name);

    const events = [];
    const teamColumns = ['C', 'D', 'E', 'G', 'H', 'I', 'K', 'L', 'M', 'O', 'P', 'Q', 'S', 'T', 'U'];
    const hourRow = 5; // start of the hours
    const weeksStart = []; // array of the row numbers where the weeks start

    // set the weeksStarts array
    // A new week is if the first cell (top left) of the first day of the week is a cell
    // Where the top cell has only a bottom border and the left cell has only a right border
    for (let i = 0; i < worksheet.rowCount; i++) {
        let currentCell = worksheet.getRow(i).getCell(teamColumns[0]);

        if (currentCell.border === undefined) { continue; }
        if (currentCell.border.top === undefined) { continue; }
        if (currentCell.border.top.style === undefined) { continue; }

        if (currentCell.border.top.style === 'hair' && currentCell.border.left.style === 'hair') {
            weeksStart.push(i);
        }
    }

    console.log(weeksStart);

    // iterate through the weeks
    for (let week = 0; week < weeksStart.length; i++) {
        const weekStart = weeksStart[week];

        //loop through the days of the week
        for (let day = 0; day < 5; day++) {
            //get the events of team1 for the day
        }
    }

    // write the events to a JSON file
    // fs.writeFileSync('events.json', JSON.stringify(events));
}

await extractDayInfos();

/*json calendar exemple*/
