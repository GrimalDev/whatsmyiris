import {AuthConfig as AuthConfig} from "node-sp-auth-config";
import {Download as spDownload} from "sp-download";

export default async function pullExcelData(outputPath, configPath) {

    const fileUrl = 'https://iecm064-my.sharepoint.com/personal/boris_mallick_mediaschool_education/Documents/Partages/Planning%20annuel%20BTS%20SIO%202022-2023.xlsx';

    const spAuth = new AuthConfig({
        configPath: configPath,
        encryptPassword: true,
        saveConfigOnDisk: true
    });

    spAuth.getContext()
        .then((context) => {
            const calendarDL = new spDownload(context.authOptions);

            calendarDL.downloadFile(fileUrl, outputPath)
                .then((savedToPath) => {
                    console.log(`File saved to ${savedToPath}`);
                    return savedToPath;
                })
                .catch((error) => {
                    console.log(error);
                    return error;
                });
        })
        .catch(console.warn);
}

// pullExcelData("../src/calendar/main-calendar.xlsx")