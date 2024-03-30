import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []
    with open(csv_file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            data.append(row)

    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

# Example usage:
csv_file_path = 'key_and_data/key_indexed.csv'  # Replace 'input.csv' with the path to your CSV file
json_file_path = 'key_and_data/key_indexed.json'  # Replace 'output.json' with the desired path for the JSON output

csv_to_json(csv_file_path, json_file_path)
