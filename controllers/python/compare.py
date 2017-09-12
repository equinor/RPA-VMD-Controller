#from pandas import DataFrame, read_csv
import pandas as pd
from __builtin__ import int


bbreg_main_file = "./public/data/BRREGmain.csv.gz"
bbreg_sub_file = "./public/data/BRREGsub.csv.gz"
vendor_sap_file = "./public/data/VendorSAP.csv"
output_file = "./public/data/output.xlsx"


dtypeSAP = {
    "organisasjonsnummer" : object,
    "SAP navn" : object,
    "SAP vendor" : object
    }

main_fields = ['organisasjonsnummer', 'navn', 'konkurs', 'underAvvikling', 'underTvangsavviklingEllerTvangsopplosning']

dtypeBBREGmain = {
    "organisasjonsnummer" : int,
    "navn" : object,
    "konkurs" : object,
    "underAvvikling" : object,
    "underTvangsavviklingEllerTvangsopplosning" : object,
    }

sub_fields = ['organisasjonsnummer', 'navn', 'overordnetEnhet']

dtypeBBREGsub = {
    "organisasjonsnummer" : int,
    "navn" : object,
    "overordnetEnhet" : int
    }

def compareCSV():
    # Import CSV for BRREG
    df_main = pd.read_csv(bbreg_main_file, encoding='iso-8859-1', sep=';', skipinitialspace=True, usecols=main_fields, dtype=dtypeBBREGmain)
    df_sub = pd.read_csv(bbreg_sub_file, encoding='iso-8859-1', sep=';', skipinitialspace=True, usecols=sub_fields, dtype=dtypeBBREGsub)    
    # Rename organisasjonsnummer in sub file
    df_sub.rename(columns={'organisasjonsnummer' : 'suborganisasjonsnummer'}, inplace=True)
    
    # Read file, rename columns, remove NO prefix, remove NaN rows, typecast orgnr to int
    df_sap = pd.read_csv(vendor_sap_file, encoding='iso-8859-1', sep=';', error_bad_lines=False, dtype=dtypeSAP)
    df_sap.rename(columns={'VAT Registration No.':'organisasjonsnummer','Name 1':'SAP navn', 'SAP Vendor' : 'SAP Vendor code'}, inplace=True)
    df_sap['organisasjonsnummer'] = df_sap['organisasjonsnummer'].str.replace('\A[^\W\d_]+','')
    df_sap = df_sap.dropna(axis=0, how='any')
    df_sap['organisasjonsnummer']  = pd.to_numeric(df_sap['organisasjonsnummer'], errors='coerce')
    
    # Make bankrupt datasets
    df_main = df_main[(df_main['konkurs'] == 'J')]
    
    # Link to subunits
    df_sub = df_sub.merge(df_main, left_on='overordnetEnhet', right_on='organisasjonsnummer', how='inner')
    
    
    df_bankrupt_main_sap = pd.DataFrame
    df_bankrupt_main_sap = df_sap.merge(df_main, on='organisasjonsnummer', how='inner')
    
    df_bankrupt_main_sap.info()
    
    df_bankrupt_sub_sap = pd.DataFrame
    df_bankrupt_sub_sap = df_sap.merge(df_sub, left_on='organisasjonsnummer', right_on='suborganisasjonsnummer', how='inner')
    
    df_bankrupt_sub_sap.info()
    
    excel_writer = pd.ExcelWriter(output_file, engine='xlsxwriter')
    
    df_bankrupt_main_sap.to_excel(excel_writer, sheet_name='Main units', encoding='iso-8859-1')
    df_bankrupt_sub_sap.to_excel(excel_writer, sheet_name='Sub units', encoding='iso-8859-1')
    
    excel_writer.save()
    
    
    
    return
