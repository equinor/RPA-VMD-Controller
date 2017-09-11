var express = require('express');
var router = express.Router();
var aws_swf = require('../controllers/aws-swf-controller')


router.get('/', function(req, res, next) {
	
	
	res.render('index', {id: 'system', selected:'System info'});
	
});

module.exports = router;