# This script is for adding the Start and End index columns to my key.csv

import csv

def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

# Load text file to process
ls_text = read_text_file('ls-5-8-complete.txt')

def append_quote_indexes_to_csv(text, original_csv_path, output_csv_path):
    with open(original_csv_path, newline='', encoding='utf-8') as input_csvfile, \
         open(output_csv_path, 'w', newline='', encoding='utf-8') as output_csvfile:
        
        reader = csv.reader(input_csvfile)
        writer = csv.writer(output_csvfile)

        # Assuming the column for "Quote in LS" is named as such; adjust as needed
        headers = next(reader, None)
        if headers:
            # Append new column names for indexes
            headers.extend(['Start Index', 'End Index'])
            writer.writerow(headers)

        for row in reader:
            # Adjust the index based on your CSV structure
            # Change below depending on T TEXT or LS CORPUS that you are finding indexes for!
            quote_in_ls_index = headers.index('Quote in LS')
            quote = row[quote_in_ls_index]

            start_index = text.find(quote)
            if start_index != -1:
                end_index = start_index + len(quote)
                # Append start and end indexes to the row
                row.extend([str(start_index), str(end_index)])
            else:
                # If quote not found, append empty values or placeholders
                row.extend(['', ''])
                print(f"Quote not found: {quote}")
            
            writer.writerow(row)

# Adjust paths as necessary
original_csv_path = 'key_3-26-24.csv'
output_csv_path = 'key_with_indexes.csv'
append_quote_indexes_to_csv(ls_text, original_csv_path, output_csv_path)

print(f"Output CSV with indexes created: {output_csv_path}")
