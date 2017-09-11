#!/usr/bin/python

import boto3
from botocore.client import Config
import uuid

botoConfig = Config(connect_timeout=50, read_timeout=70)
swf = boto3.client('swf', config=botoConfig)

DOMAIN = "Blue Prism"
WORKFLOW = "VerifyOrgId"
VERSION = "0.1"
TASKLIST = "verify_org"

TASK1 = "GetCSV-BREG"
TASK1v = "0.1"
TASK1_LIST = "get_master"
TASK2 = "PutCSV-SAP"
TASK2v = "0.1"
TASK2_LIST = "get_compare"
TASK3 = "CompareLists"
TASK3v = "0.1"
TASK3_LIST = "compare"

print "Listening for Decision Tasks"

while True:
    newTask = swf.poll_for_decision_task(
        domain=DOMAIN,
        taskList={'name': TASKLIST},
        identity='decider-1',
        reverseOrder=False
    )

    # Check if there are any tasks
    if 'taskToken' not in newTask:
        print "Poll timed out, no new task.  Repoll"

    # Find latest task that is not a decision task
    elif 'events' in newTask:
        eventHistory = [evt for evt in newTask['events'] if not evt['eventType'].startswith('Decision')]
        lastEvent = eventHistory[-1]
        print lastEvent
        
        if lastEvent['eventType'] == 'WorkflowExecutionStarted':
            # Start first activity
            print "Dispatching task to worker", newTask['workflowExecution'], newTask['workflowType']
        
            swf.respond_decision_task_completed(
                taskToken=newTask['taskToken'],
                decisions=[
                    {
                        'decisionType': 'ScheduleActivityTask',
                        'scheduleActivityTaskDecisionAttributes': {
                            'activityType':{
                                'name': TASK1,
                                'version': TASK1v
                            },
                        'activityId': 'activityid-' + str(uuid.uuid4()),
                        'input': '',
                        'scheduleToCloseTimeout': 'NONE',
                        'scheduleToStartTimeout': 'NONE',
                        'startToCloseTimeout': 'NONE',
                        'heartbeatTimeout': 'NONE',
                        'taskList': {'name': TASKLIST},
                        }
                     }
                ]
            )
            print "Task 1 Dispatched:", newTask['taskToken']
    
        elif lastEvent['eventType'] == 'ActivityTaskCompleted':
            
            startId = lastEvent['activityTaskCompletedEventAttributes']['scheduledEventId']
            activity_name = ""
            
            for evt in eventHistory:
                if evt['eventId'] == startId:
                    activity_name = evt['activityTaskScheduledEventAttributes']['activityType']['name']
            
            # Get result
            result = lastEvent['activityTaskCompletedEventAttributes'].get('result')
            
            if activity_name == TASK1:
                print "im a bit furher"
                swf.respond_decision_task_completed(
                taskToken=newTask['taskToken'],
                decisions=[
                    {
                        'decisionType': 'ScheduleActivityTask',
                        'scheduleActivityTaskDecisionAttributes': {
                            'activityType': {
                                'name': TASK2,
                                'version': TASK2v
                            },
                        'activityId': 'activityid-' + str(uuid.uuid4()),
                        'input': '',
                        'scheduleToCloseTimeout': 'NONE',
                        'scheduleToStartTimeout': 'NONE',
                        'startToCloseTimeout': 'NONE',
                        'heartbeatTimeout': 'NONE',
                        'taskList': {'name': TASKLIST},
                        }
                     }
                ]
                )
                print "Task 2 Dispatched:", newTask['taskToken']
                
            elif activity_name == TASK2:
                swf.respond_decision_task_completed(
                taskToken=newTask['taskToken'],
                decisions=[
                    {
                        'decisionType': 'ScheduleActivityTask',
                        'scheduleActivityTaskDecisionAttributes': {
                            'activityType':{
                                'name': TASK3,
                                'version': TASK3v
                            },
                        'activityId': 'activityid-' + str(uuid.uuid4()),
                        'input': '',
                        'scheduleToCloseTimeout': 'NONE',
                        'scheduleToStartTimeout': 'NONE',
                        'startToCloseTimeout': 'NONE',
                        'heartbeatTimeout': 'NONE',
                        'taskList': {'name': TASKLIST},
                        }
                     }
                    ]
                )
                print "Task 3 Dispatched:", newTask['taskToken']
    
            elif activity_name == TASK3:
                swf.respond_decision_task_completed(
                taskToken=newTask['taskToken'],
                decisions=[
                    {
                        'decisionType': 'CompleteWorkflowExecution',
                        'completeWorkflowExecutionDecisionAttributes': {
                            'result': 'success'
                        }
                    }
                    ]
                )
                print "Task Completed!"       
        # Complete workflow
