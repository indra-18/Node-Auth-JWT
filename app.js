let express = require('express'),
    path = require('path'),
    cors = require('cors'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/db');

require('./config/passport')(passport);
mongoose.connect(config.db, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());


/**
 * Server Routes
 */

app.get('/', function(req, res) {
    res.send('Page under construction.');
});

// Calling routes
let authentication = require('./routes/auth');
let book = require('./routes/book');

// Using routes
app.use('/api', authentication);
app.use('/api', passport.authenticate('jwt', { session: false}), book);

/**
 * End Server Routes
 */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

/*
morgan is a logging middleware that logs HTTP requests to the console. 
It provides different levels of logging (e.g., "dev", "combined", "common") and 
can be configured with custom logging formats.

cookie-parser is a middleware that parses cookies attached to incoming HTTP requests and 
makes them available as an object on the req.cookies property.

body-parser is a middleware that parses incoming request bodies in a variety of 
formats (e.g., JSON, URL-encoded) and makes the parsed data available on the req.body property.

In this code, logger and morgan are used interchangeably for logging HTTP requests, 
but it's redundant to include both. It's common to use either one or the other. 
The cookie-parser and body-parser are used to parse cookies and request bodies respectively.


app.use(logger('dev')); ?????????????

This line of code uses the morgan middleware to log HTTP requests to the console with a specific format. 
The format is specified as 'dev', which is a predefined format that logs each request with the HTTP method, 
response status code, response time, requested URL, and referrer (if available).

For example, a sample log entry might look like:
GET /api/books 200 16.918 ms - 38

This line of code should be used during development, as it provides detailed information about each request, 
including response time, which can be useful for debugging and performance optimization.

However, it's recommended to turn off logging or switch to a less detailed 
format (e.g., 'combined' or a custom format) in production, as detailed logging can impact performance and 
may expose sensitive information.

*/