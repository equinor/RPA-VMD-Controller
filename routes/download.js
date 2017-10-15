var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res, next) {
	console.log("test: " + req.query.runId);
	
	// Fail check if file exist

	res.sendFile(process.env.UPLOAD_PATH + process.env.DOWNLOAD_FILE_NAME)
	
	
});


router.get('/status', function(req, res, next) {
	
	var response = {
		runId: req.query.runId,
		workflowId: req.query.workflowId,
		statuscode: -1,
		statustext: ''
	}
	
	
	aws_swf.getWorkflowStatus(req.query.runId, req.query.workflowId, function(result) {
		if (!result) {
			response.statuscode = -1
			response.statustext = 'Not found'
			res.send(response)
		} else if (result.executionInfo.executionStatus == "CLOSED") {
			// This needs to be further refined to take failed execution of WF
			response.statuscode = 1
			response.statustext = 'Done'
			res.send(response)
		} else {
			response.statuscode = 0
			response.statustext = 'Not finished'
			res.send(response);
		}
		
	})	

}); 


module.exports = router;