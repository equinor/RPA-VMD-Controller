#!/usr/bin/python

import urllib2, os, time
from pathlib import Path

URLmainunits = 'http://data.brreg.no/enhetsregisteret/download/enheter'
URLsubunits = 'http://data.brreg.no/enhetsregisteret/download/underenheter'

FILEmainunits = "./public/data/BRREGmain.csv.gz"
FILEsubunits = "./public/data/BRREGsub.csv.gz"

time_now = time.time()
expire = 604800

main_file = Path(FILEmainunits)
sub_file = Path(FILEsubunits)

def get_brreg():
    if not main_file.is_file():
        # Get main file
        print "Main file is missing, getting it.."
        response = urllib2.urlopen(URLmainunits)
        data = response.read()
        
        filename = FILEmainunits
        file_ = open(filename, 'w')
        file_.write(data)
        file_.close()
    else:
        st = os.stat(main_file.as_posix())
        dur = time_now - st.st_ctime
        print "Main file age: " + str(dur)
        
        if (dur > expire):
            print "Main file too old, getting a new one"
            os.remove(FILEmainunits)
            
            response = urllib2.urlopen(URLmainunits)
            data = response.read()
            
            filename = FILEmainunits
            file_ = open(filename, 'w')
            file_.write(data)
            file_.close()
            
    if not sub_file.is_file():
        # Get sub file
        print "Sub file is missing, getting it.."
        response = urllib2.urlopen(URLsubunits)
        data = response.read()
        
        filename = FILEsubunits
        file_ = open(filename, 'w')
        file_.write(data)
        file_.close()
    else:
        st = os.stat(sub_file.as_posix())
        dur = time_now - st.st_ctime
        print "Sub file age: " + str(dur)
        
        if (dur > expire):
            print "Sub file too old, getting a new one"
            os.remove(FILEsubunits)
            
            response = urllib2.urlopen(URLsubunits)
            data = response.read()
            
            filename = FILEsubunits
            file_ = open(filename, 'w')
            file_.write(data)
            file_.close()
    return;

if __name__ == "__main__":
    get_brreg()
