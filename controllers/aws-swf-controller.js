var aws = require('aws-sdk');
var proxy = require('proxy-agent');
const uuidv1 = require('uuid/v1');
var aws_swf_models = require('../models/aws-swf-models')

var aws_swf = null;

var state = {
	awf_swf: null
}

exports.connect = function(callback) {
	if (state.awf_swf) return done()
	
	aws_swf = new aws.SWF;

	if (process.env.ENV == 'PRODUCTION') {
		aws.config.update({
		    httpOptions: { agent: proxy('http://www-authproxy.statoil.net:8080') }
			});
		
	}
	
	state.aws_swf = aws_swf;
	
}

exports.get = function() {
	return state.aws_swf;
}


exports.getWorkflowList = function getWorkflowList(callback) {
	// Get one day
	var lateDate = new Date();
	var delta = Date.now() - 24*3600*1000 // subtract one day
	var oldDate = new Date(delta) // Make date object for one day back
	
	aws_swf_models.wf_list_params.startTimeFilter.oldestDate = oldDate;
	aws_swf_models.wf_list_params.startTimeFilter.latestDate = lateDate;
	
	
	aws_swf.listOpenWorkflowExecutions(aws_swf_models.wf_list_params, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			return callback(null)
		}
		else {
			console.log(data);           // successful response
			return callback(data)
		}
	});
}

exports.startWorkflow = function startWorkflow(callback) {
	aws_swf_models.start_wf_params.workflowId = uuidv1();
	var ret;
	
	aws_swf.startWorkflowExecution(aws_swf_models.start_wf_params, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			return callback(null);
		} else {
			console.log("run id: "+ data.runId);
			console.log(aws_swf_models.start_wf_params.workflowId)
			
			
			ret = {runId: data.runId, workflowId: aws_swf_models.start_wf_params.workflowId};
			
			return callback(ret);
			
		}
	});
}

exports.getWorkflowStatus = function getWorkflowStatus(runId, workflowId, callback) {
	aws_swf_models.wf_params.execution.runId = runId
	aws_swf_models.wf_params.execution.workflowId = workflowId
	
	aws_swf.describeWorkflowExecution(aws_swf_models.wf_params, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			return callback(null)
		} else {
			console.log("success: " + data);           // successful response
			
			return callback(data)
			
		}
	});
}