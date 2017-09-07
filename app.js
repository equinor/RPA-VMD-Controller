require('dotenv').config({path:__dirname+'/process.env'});
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var swf = require('aws-swf');
var aws = require('aws-sdk');
var proxy = require('proxy-agent');
var awsswf = require('aws-swf').AWS;
var index = require('./routes/index');

var app = express();



console.log(__dirname);
console.log(process.env.ENV);

if (process.env.ENV == 'PRODUCTION') {
	aws.config.update({
	    httpOptions: { agent: proxy('http://www-authproxy.statoil.net:8080') }
		});
	
	awsswf.config = aws.config;
}

var workflow = new swf.Workflow({
   "domain": "Blue Prism",
   "workflowType": {
      "name": "VerifyOrgId",
      "version": "0.1"
   },
   "taskList": { "name": "verify_org" },
   "executionStartToCloseTimeout": "1800",
   "taskStartToCloseTimeout": "1800",
   "tagList": ["webinitated"],
   "childPolicy": "TERMINATE"
});

// setup multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, 'csvfile.csv')
  }
});
 
var upload = multer({ storage: storage });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.post('/', upload.single('csvupload'),function(req, res) {
	  res.send("File upload sucessfully.");
	  // Start AWS workflow
	console.log("Starting workflow");  
	var workflowExecution = workflow.start({ input: "any data ..."}, function (err, runId) {
		if (err) { console.log("Cannot start workflow : ", err); return; }  
		console.log("Workflow started, runId: " +runId);
		 console.log(workflow);
	  });
	  
	  
	});

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
