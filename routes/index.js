var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {id: 'main', selected: 'Start workflow'});
});


module.exports = router;
