#!/usr/bin/python

VMD_CONFIG = {
    'bbreg_main_file': '/private/frskja/RPA/RPA-VMD-Controller/public/data/BRREGmain.csv.gz',
    'bbreg_sub_file': '/private/frskja/RPA/RPA-VMD-Controller/public/data/BRREGsub.csv.gz',
    'vendor_sap_file': '/private/frskja/RPA/RPA-VMD-Controller/public/uploads/vendorsap.csv',
    'output_file': '/private/frskja/RPA/RPA-VMD-Controller/public/uploads/output.xlsx',
    'URLmainunits': 'http://data.brreg.no/enhetsregisteret/download/enheter',
    'URLsubunits': 'http://data.brreg.no/enhetsregisteret/download/underenheter',
    'bbreg_file_expire': 604800,
    'environment': 'PROD',
    'splunk-server': 'ws1583.statoil.net',
    'splunk-token': 'BA3920F7-0B33-4109-AFE7-7AED18EEB05F'
}

