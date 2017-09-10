var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res, next) {
	aws_swf.getWorkflowList(function (result){
		console.log("i am here")
	})
	
	
	res.render('index', {id: 'listwf', selected:'Workflow status'});
});



module.exports = router;