import express from 'express';
import path from 'path';
import logger from 'morgan';
import createError from 'http-errors';
import {fileURLToPath} from "url";
import fs from "fs";

//route imports
import homeRouter from './routes/home.js';
import calendarRouter from './routes/calendar.js';
import pullExcelData from "./app/excelCalendarData.js";
import extractDayInfos from "./app/calendarHandle.js";

const app = express();
const listeningPort = 80
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if state is not in production use sass middleware
if (process.env.NODE_ENV !== 'production') {
  try {
    await import('node-sass-middleware').then((sassMiddleware) => {
      app.use(sassMiddleware({
        src: __dirname + '/public',
        dest: __dirname + '/public',
        indentedSyntax: true,
        sourceMap: true,
      }));
    });
  } catch {
    console.log('Ignoring Node Sass Middleware')
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/calendar', calendarRouter);
//return fullCalendar libraries
app.use('/fullcalendar', express.static(path.join(__dirname, 'node_modules/@fullcalendar/')));

//TODO: Oauth microsoft mediaschool

// catch 404 and forward to error handlerchest-model-v2.usdz
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(listeningPort, (err) => {
  if (err) { throw err }
  console.log(`App running on http://localhost:${listeningPort} !`);
})

//download the excel file every hour
setInterval(async () => {
  await pullExcelData('src/calendar/main-calendar.xlsx');
  const calendarJSON = await extractDayInfos('src/calendar/main-calendar.xlsx');
  //write the calendarJSON to a file
  fs.writeFile('src/calendar/calendar.json', JSON.stringify(calendarJSON), (err) => {
    if (err) {
      console.error(err);
    }
  });
}, 3600000);