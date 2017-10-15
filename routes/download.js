var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res, next) {
	console.log("test: " + req.query.runId);
	
	// Fail check if file exist

	res.sendFile(process.env.UPLOAD_PATH + process.env.DOWNLOAD_FILE_NAME)
	
	
});


router.get('/status', function(req, res, next) {
	
	var response = [{
		runId: req.query.runId,
		workflowId: req.query.workflowId,
		statuscode: -1,
		statustext: ''
	}]
	
	
	aws_swf.getWorkflowStatus(req.query.runId, req.query.workflowId, function(result) {
		if (!result) {
			response[0].statuscode = -1
			response[0].statustext = 'Not found'
			res.json(response)
		} else if (result.executionInfo.executionStatus == "CLOSED") {
			// This needs to be further refined to take failed execution of WF
			response[0].statuscode = 1
			response[0].statustext = 'Done'
			res.json(response)
		} else {
			response[0].statuscode = 0
			response[0].statustext = 'Not finished'
			res.json(response);
		}
		
	})	

}); 


module.exports = router;