import {AuthConfig as AuthConfig} from "node-sp-auth-config";
import {Download as spDownload} from "sp-download";

export default async function pullExcelData() {

    const fileUrl = 'https://iecm064-my.sharepoint.com/personal/boris_mallick_mediaschool_education/Documents/Partages/Planning%20annuel%20BTS%20SIO%202022-2023.xlsx';
    const filePath = './src/calendar/calendar-main.xlsx'

    const spAuth = await new AuthConfig({
        configPath: './config/sp-config.json',
        encryptPassword: true,
        saveConfigOnDisk: true
    });

    spAuth.getContext()
        .then((context) => {
            const calendarDL = new spDownload(context.authOptions);

            calendarDL.downloadFile(fileUrl, filePath)
                .then((savedToPath) => {
                    return savedToPath;
                })
                .catch((error) => {
                    return error;
                });
        })
        .catch(console.warn);
}
