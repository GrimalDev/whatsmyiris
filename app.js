import express from 'express';
import path from 'path';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import createError from 'http-errors';
import {fileURLToPath} from "url";

//route imports
import indexRouter from './routes/index.js';
import calendarRouter from './routes/calendar.js';

const app = express();
const listeningPort = 5232
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/calendar', calendarRouter);
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
