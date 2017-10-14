#!/usr/bin/python

from pathlib import Path

FILEvendorsap = "./public/uploads/vendorsap.csv"

def checkSAPcsv():
    sap_file = Path(FILEvendorsap)
    
    if not sap_file.is_file():
        print "No SAP file - error"
        return 0
    else:
        print "Found SAP file"
        return -1
    
if __name__ == "__main__":
    checkSAPcsv()