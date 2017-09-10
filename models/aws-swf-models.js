// Global configuration
var SWF_DOMAIN = 'Blue Prism';
var WF_TYPE_NAME = 'VerifyOrgId';
var WF_TYPE_VER = '0.1';
var TASK_LIST_NAME = 'verify_org'

module.exports = {
	// Used for getting a specific workflow
	wf_params: {
		domain: SWF_DOMAIN, 
			execution: { 
				runId: null, 
			    workflowId: null
			}
	},
	
	// Used for starting workflow
	start_wf_params: {
		domain: SWF_DOMAIN, 
		workflowId: null, 
		workflowType: { 
			name: WF_TYPE_NAME, 
			version: WF_TYPE_VER 
		},
		childPolicy: 'TERMINATE',
		executionStartToCloseTimeout: '1800',
		input: 'Start from web',
		tagList: [
			'webinated'
		],
		taskList: {
			name: 'TASK_LIST_NAME'
		},
		taskStartToCloseTimeout: '1800'
	},
	
		// Used for getting a list of executed workflows
	wf_list_params: {
		domain: SWF_DOMAIN, /* required */
		startTimeFilter: { /* required */
			oldestDate: new Date, /* required */
			latestDate: new Date
		},
		typeFilter: {
			name: WF_TYPE_NAME, /* required */
			version: WF_TYPE_VER
		}
	}
}