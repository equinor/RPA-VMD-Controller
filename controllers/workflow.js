var ps = require('ps-node');
var python_shell = require('python-shell');

var PYTHON_WORKER_PROCNAME = 'worker.py'
var PYTHON_WORKER_PATH = './controllers/python/worker.py'
var PYTHON_DECIDER_PROCNAME = 'decider.py'
var PYTHON_DECIDER_PATH = './controllers/python/decider.py'

console.log(process.cwd());	


	
var decider = null
var worker = null

var state = {
	decider: null,
	worker: null
}

exports.getStatus = function(){
	return state;
}

exports.start = function start() {
	checkSystem(PYTHON_WORKER_PROCNAME, function(res) {
		if (res) {
			worker = res
			state.worker = worker;
		} else {
			console.log("Start python worker")
			startPython(PYTHON_WORKER_PATH)
		}
	})
	
	checkSystem(PYTHON_DECIDER_PROCNAME, function(res) {
		if (res) {
			decider = res
			state.decider = decider;
		} else {
			console.log("Starting decider")
			startPython(PYTHON_DECIDER_PATH)
		}
	})
	
}

function checkSystem(process_name, callback) {
	
	ps.lookup({
		command: 'python',
		arguments: process_name
		}, function(err, resList) {
			if(err) {
				throw new Error(err);
			}
			console.log("reslist: " + resList)
			
			resList.forEach(function(process) {
				if(process) return callback(process);
			});
			
			if(resList == '') return callback(null);
			
	})
}
		

function startPython (cmd) {
	var pshell = python_shell.run(cmd, function (err) {
		if(err) throw new Error(err)
	})
	
	
}

