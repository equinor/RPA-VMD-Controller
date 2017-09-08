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
const uuidv1 = require('uuid/v1');
var index = require('./routes/index');


var app = express();
var aws_swf = new aws.SWF;

if (process.env.ENV == 'PRODUCTION') {
	aws.config.update({
	    httpOptions: { agent: proxy('http://www-authproxy.statoil.net:8080') }
		});
	
}

var wf_params = {
	domain: 'Blue Prism', 
		execution: { 
			runId: '', 
		    workflowId: '' 
		}
	};

var start_wf_params = {
	domain: 'Blue Prism', 
	workflowId: '', 
	workflowType: { 
		name: 'VerifyOrgId', 
		version: '0.1' 
	},
	childPolicy: 'TERMINATE',
	executionStartToCloseTimeout: '1800',
	input: 'Start from web',
	tagList: [
		'webinated'
	],
	taskList: {
		name: 'verify_org'
	},
	taskStartToCloseTimeout: '1800'
};

function startWorkflow(callback) {
	start_wf_params.workflowId = uuidv1();
	var ret;
	
	aws_swf.startWorkflowExecution(start_wf_params, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			return callback(null);
		} else {
			console.log("run id: "+ data.runId);
			console.log(start_wf_params.workflowId)
			
			
			ret = {runId: data.runId, workflowId: start_wf_params.workflowId};
			
			return callback(ret);
			
		}
	});
}

function getWorkflowStatus(callback) {
	
	aws_swf.describeWorkflowExecution(wf_params, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			return callback(null)
		} else {
			console.log("success: " + data);           // successful response
			
			return callback(data)
			
		}
	});
}

// setup multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, process.env.UPLOAD_FILE_NAME)
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


app.get('/download', function (req, res){
	
	console.log("test: " + req.query.runId);
	
	wf_params.execution.runId = req.query.runId
	wf_params.execution.workflowId = req.query.workflowId;
	
	getWorkflowStatus(function(result) {
		if (!result) {
			res.send("not found")
		} else if (result.executionInfo.executionStatus == "CLOSED") {
			res.sendFile(__dirname + '/public/uploads/' + 'csvfile.csv' )
		} else {
			console.log("WF status: " + result.executionInfo.executionStatus)
			res.send("not finished");
		}
		
	})

});



app.use('/', index);

app.post('/', upload.single('csvupload'),function(req, res) {	
	// Start AWS workflow
	console.log("Starting workflow");
	startWorkflow(function(result) {
		res.send(result);
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
