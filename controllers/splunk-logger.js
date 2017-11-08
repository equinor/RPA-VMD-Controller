var SplunkLogger = require("splunk-logging").Logger;

var config = {
	token: process.env.SPLUNK_TOKEN,
	url: process.env.SPLUNK_SERVER
};

var Logger = new SplunkLogger(config);

console.log(config)

var payload = {
    // Message can be anything, it doesn't have to be an object
    message: {
        sysmsg: ""
    },
    // Metadata is optional
    metadata: {
        source: "",
        sourcetype: "httpevent",
        index: process.env.SPLUNK_INDEX,
        host: process.env.SPLUNK_HOST
    },
    // Severity is also optional
    severity: ""
};

exports.log = function (msg, severity, source){
	payload.message.sysmsg = msg;
	payload.severity = severity
	payload.source = source
	
	Logger.send(payload, function(err, resp, body) {
		console.log("Response from splunk: " + body)
	})
}