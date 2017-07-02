var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var topics = require('./routes/topics').router;
var consumer = require('./routes/topics').consumer;
var producer = require('./routes/topics').producer;
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/topics', topics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
    res.send('error');
});
app.listen(process.env.PORT, function () {
    console.info({msg: 'Server listening on port ' + process.env.PORT + '...'
    });
});

process.on('uncaughtException', function (error) {
    console.info(error);
});

module.exports = app;
