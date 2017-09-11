var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res, next) {
	console.log("test: " + req.query.runId);

	
	aws_swf.getWorkflowStatus(req.query.runId, req.query.workflowId, function(result) {
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

module.exports = router;