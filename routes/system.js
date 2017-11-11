var express = require('express');
var router = express.Router();
var workflow = require('../controllers/workflow');

var state = {
	decider: null,
	worker: null
};

var status = {
    decider : {
        text: 'Python decider',
        pid: -1,
        arg: ''
    },

    worker: {
        text: 'Python worker',
        pid: -1,
        arg: ''
    }
};


router.get('/', function(req, res, next) {
	
	workflow.getStatusWorker(function (stat) {
        state.worker = stat;

        if (state.worker) {
            status.worker.pid = state.worker.pid;
            status.worker.arg = state.worker.arguments[0];
        } else // state is null
        {
            status.worker.pid = -1;
            status.worker.arg = '';
        }

    });

    workflow.getStatusDecider(function (stat) {
        state.decider = stat;

        if (state.decider) {
            status.decider.pid = state.decider.pid;
            status.decider.arg = state.decider.arguments[0];
        } else // state is null
        {
            status.decider.pid = -1;
            status.decider.arg = ''
        }

    });

	res.render('index', {id: 'system', selected:'System info', sysStat:status});
	
});

module.exports = router;