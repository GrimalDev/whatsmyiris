import express from 'express';
import path from 'path';
import logger from 'morgan';
import createError from 'http-errors';
import {fileURLToPath} from "url";
import fs from "fs";
import { CronJob } from 'cron';
import getCalendarJSON from './app/calendarController.js';

//dotenv config
import dotenv from "dotenv";
dotenv.config();

//route imports
import homeRouter from './routes/home.js';
import calendarRouter from './routes/calendar.js';

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
app.use('/libs/fullcalendar', express.static(path.join(__dirname, 'src/libs/fullcalendar/')));

//TODO: Oauth microsoft mediaschool

// catch 404 and forward to error handlerchest-model-v2.usdz
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500);

    // set locals, only providing error in development
    res.locals.message = err.status === 404 ? "Vous vous êtes perdu?" : "Une erreur est survenue...";
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

    //By choice, there is no error page
    if (process.env.NODE_ENV === 'production' ) {
        res.redirect('/')
    }

    res.render('error');
});

//if the calendar.json file does not exist, create it and call the function to get the calendar
if (!fs.existsSync(path.join(__dirname, 'src/calendar/calendar.json'))) {
    await getCalendarJSON();
}

app.listen(listeningPort, (err) => {
  if (err) { throw err }
  console.log(`App running on http://localhost:${listeningPort} !`);
});

//Add cron to call the calendarController function every hour in paris time
const job = new CronJob('0 0 * * * *', getCalendarJSON, null, true, 'Europe/Paris');
//TODO: LOG THE JOB