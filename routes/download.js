var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res) {
	//var request_params = req.body[0]
	//var runId = request_params.runId
	//var workflowId = request_params.workflowId
	
	// Fail check if file exist

	res.sendFile(process.env.UPLOAD_PATH + process.env.DOWNLOAD_FILE_NAME)
	
	
});

router.post('/status/', function(req, res) {
		
	var request_params = req.body[0]
	var runId = request_params.runId
	var workflowId = request_params.workflowId
	
	console.log("runId: " + runId + " workflowId: " + workflowId)
	
	
	
	var response = {
		runId: runId,
		workflowId: workflowId,
		statuscode: -1,
		statustext: ''
	}
	
	
	aws_swf.getWorkflowStatus(runId, workflowId, function(result) {
		if (!result) {
			response.statuscode = -1
			response.statustext = 'Not found'
			res.json(response)
		} else if (result.executionInfo.executionStatus == "CLOSED") {
			// This needs to be further refined to take failed execution of WF
			response.statuscode = 1
			response.statustext = 'Done'
			res.json(response)
		} else {
			response.statuscode = 0
			response.statustext = 'Not finished'
			res.json(response);
		}
		
	})	

}); 


module.exports = router;