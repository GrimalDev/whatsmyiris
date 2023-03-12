import {AuthConfig as AuthConfig} from "node-sp-auth-config";
import {Download as spDownload} from "sp-download";

export default async function pullExcelData(outputPath) {

    const fileUrl = 'https://iecm064-my.sharepoint.com/personal/boris_mallick_mediaschool_education/Documents/Partages/Planning%20annuel%20BTS%20SIO%202022-2023.xlsx';

    try {
        const calendarDL = new spDownload();

        calendarDL.downloadFile(fileUrl, outputPath)
            .then((savedToPath) => {
                console.log(`File saved to ${savedToPath}`);
                return savedToPath;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
    } catch (error) {
        console.error(error);
        return error;
    }
}