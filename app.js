require('dotenv').config({path:__dirname+'/process.env'});
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const formidable = require('formidable');
var fs = require('fs');

// Controllers
var aws_swf = require('./controllers/aws-swf-controller');
var workflow = require('./controllers/workflow')
// Modules
var index = require('./routes/index');
var listwf = require('./routes/listwf');
var upload = require('./routes/upload');
var download = require('./routes/download')
var system = require('./routes/system')

// Connect to AWS SWF and start decider/worker
aws_swf.connect();
workflow.start();


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Formidabele handles uploads via API
app.use(function (req, res, next) {
    var form = new formidable.IncomingForm({
        encoding: 'utf-8',
        uploadDir: process.env.UPLOAD_PATH,
        keepExtensions: true
    })
    form.once('error', console.log)
    form.parse(req, function (err, fields, files) {
        Object.assign(req, {fields, files});
        next();
    })
    form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        fs.rename(file.path, form.uploadDir + "/" + file.name, function(err) {
        		if (err) throw err;
        });
    });
})
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/listwf', listwf)
app.use('/upload', upload)
app.use('/download', download)
app.use('/system', system)


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
  res.render('error');
});

module.exports = app;
