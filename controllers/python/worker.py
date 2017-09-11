#!/usr/bin/python

import boto3
from botocore.client import Config
import compare
import getsap_csv
import getbrreg_csv

botoConfig = Config(connect_timeout=50, read_timeout=70)
swf = boto3.client('swf', config=botoConfig)

DOMAIN = "Blue Prism"
WORKFLOW = "VerifyOrgId"
VERSION = "0.1"
TASKLIST = "verify_org"

TASK1 = "GetCSV-BREG"
TASK1v = "0.1"
TASK2 = "PutCSV-SAP"
TASK2v = "0.1"
TASK3 = "CompareLists"
TASK3v = "0.1"

#Functions
def respond_act(status):
    swf.respond_activity_task_completed(
    taskToken=task['taskToken'],
    result=status
    )
    return;

print "Listening for Worker Tasks"

while True:

    task = swf.poll_for_activity_task(
        domain=DOMAIN,
        taskList={'name': TASKLIST},
        identity='worker-1')

    if 'taskToken' not in task:
        print "Poll timed out, no new task.  Repoll"

    else:
        print "New task arrived"
        
        task_name = task['activityType']['name']
        
        if (task_name == TASK1):
            print TASK1
            getsap_csv.checkSAPcsv()
            respond_act('success')
                   
        elif (task_name == TASK2):
            print TASK2
            getbrreg_csv.get_brreg()
            respond_act('success')
            
        elif (task_name == TASK3):
            print TASK3
            compare.compareCSV()
            respond_act('success')
        
    print "Task Done"
    
