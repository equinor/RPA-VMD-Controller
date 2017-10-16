#!/usr/bin/python

from pathlib import Path
import config

vendor_sap_file = config.VMD_CONFIG['vendor_sap_file']

def checkSAPcsv():
    sap_file = Path(vendor_sap_file)
    
    if not sap_file.is_file():
        print "No SAP file - error"
        return 0
    else:
        print "Found SAP file"
        return -1
    
if __name__ == "__main__":
    checkSAPcsv()