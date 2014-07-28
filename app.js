const CLIENT_ID = '527812630770-2sr7oa2mgt2rdho2p32us4m5474t6qvi.apps.googleusercontent.com';
const CLIENT_SECRET = '5NLH5gJYeCXBuNXMK55-vpSD';
const REFRESH_TOKEN = '1/5oTVzf6soH0epIlVt61ixmWDdvfomFV0HICsUr8P-lo';
const ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2';
const PARENT_FOLDER_ID = '0B7aIJHP3Wv7aNW9QS3M4N1BiUUE';


var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
var async = require('async');
var request = require('request');
var fs = require('fs');

var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fsextra = require('fs-extra'); 

var routes = require('./routes/index');
var users = require('./routes/users');
var uploads = require('./routes/uploads');
var fupload = require('./routes/fupload');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser({uploadDir:'./uploads'}));

app.use('/', routes);
app.use('/users', users);
app.use('/uploads', uploads);
app.use('/fupload', fupload);
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
