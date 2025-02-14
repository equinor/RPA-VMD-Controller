var express = require('express');
var router = express.Router();
var multer  = require('multer');
var aws_swf = require('../controllers/aws-swf-controller')

// setup multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, process.env.UPLOAD_FILE_NAME)
  }
});
 
var upload = multer({ storage: storage });

router.post('/', upload.single('csvupload'), function(req, res) {
	// Start AWS workflow
	console.log("Starting workflow");
	aws_swf.startWorkflow(function(result) {
		console.log(result)
		res.render('index', {id: 'upload', selected: 'Upload', runId: result.runId, wfId: result.workflowId});
	});
});

/**
router.post('/api', function(req, res) {
	
	console.log('event in api upload')
	console.log(req.fields); // contains non-file fields
	console.log(req.files); // contains files
	  
	res.send('blah')	
}); 
*/


module.exports = router;