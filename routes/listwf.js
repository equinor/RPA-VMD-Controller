var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res, next) {
	
	aws_swf.getWorkflowList(function (result){
		
		var tbl_wf = [];

		if (result) {
			console.log("result: " + result.executionInfos)
			console.log("length: " + result.executionInfos.length)
			var indx
			for (indx = 0; indx < result.executionInfos.length; ++indx) {
				console.log(result.executionInfos[indx]);
				console.log("in loop");
				
				var tmp = result.executionInfos[indx]
				var tbl_entry = [tmp.execution.workflowId, tmp.execution.runId, tmp.workflowType.name, tmp.executionStatus, tmp.startTimestamp]
				
				tbl_wf.push(tbl_entry);
				console.log(tbl_wf);
				
			}
		}
		
		
		res.render('index', {id: 'listwf', selected:'Workflow status', wflist: tbl_wf});
	})
	
});

module.exports = router;