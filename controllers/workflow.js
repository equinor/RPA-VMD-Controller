var ps = require('ps-node');
var python_shell = require('python-shell');

var PYTHON_WORKER_PROCNAME = 'worker.py';
var PYTHON_WORKER_PATH = './controllers/python/worker.py';
var PYTHON_DECIDER_PROCNAME = 'decider.py';
var PYTHON_DECIDER_PATH = './controllers/python/decider.py';

var decider = null;
var worker = null;

exports.start = function start() {
	checkSystem(PYTHON_WORKER_PROCNAME, function(res) {
		if (res) {
			worker = res
		} else {
			console.log("Start python worker");
			startPython(PYTHON_WORKER_PATH)
		}
	});
	
	checkSystem(PYTHON_DECIDER_PROCNAME, function(res) {
		if (res) {
			decider = res
		} else {
			console.log("Starting decider");
			startPython(PYTHON_DECIDER_PATH)
		}
	})
	
};

exports.getStatusWorker = function(callback) {

    checkSystem(PYTHON_WORKER_PROCNAME, function (res) {
        if (res) return callback(res);
        else return callback(null)
    })
};

exports.getStatusDecider = function(callback) {

	checkSystem(PYTHON_DECIDER_PROCNAME, function(res) {
		if (res) return callback(res);
        else return callback(null)
	})
};

function checkSystem(process_name, callback) {
	
	ps.lookup({
		command: 'python',
		arguments: process_name
		}, function(err, resList) {
                if(err) {
                    throw new Error(err);
                }
                // Empty
                if(resList.length == 0) return callback(null);

                resList.forEach(function(process) {
                    if(process) return callback(process);
			});

	})
}

function startPython (cmd) {
    python_shell.run(cmd, function (err) {
		if(err) throw new Error(err)
	})
}

