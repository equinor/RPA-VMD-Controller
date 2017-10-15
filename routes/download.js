var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/:runId/:workflowId', function(req, res) {
	console.log("test: " + req.params.runId);
	
	// Fail check if file exist

	res.sendFile(process.env.UPLOAD_PATH + process.env.DOWNLOAD_FILE_NAME)
	
	
});


router.get('/status/:runId/:workflowId', function(req, res) {
	
	console.log("content of request: ")
	console.log(req.params.runId)
	console.log(req.params.workflowId)
	
	var response = {
		runId: req.params.runId,
		workflowId: req.params.workflowId,
		statuscode: -1,
		statustext: ''
	}
	
	
	aws_swf.getWorkflowStatus(req.params.runId, req.params.workflowId, function(result) {
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