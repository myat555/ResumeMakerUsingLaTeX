#!/bin/bash

# Define the output directory
output_dir="generated"

# Create the output directory if it doesn't exist
mkdir -p "$output_dir"

echo "Testing API with different inputs..."

# Define test cases
declare -a test_cases=("resume1" "resume2" "resume3" "resume4" "resume5")

# Loop through the test cases
for test_case in "${test_cases[@]}"; do
    echo "Running test case: $test_case"
    curl -X POST "http://localhost:5000/generate-resume" \
         -H "Content-Type: application/json" \
         -d @"$test_case.json" \
         -o "$output_dir/$test_case.pdf"
done

echo "All test cases executed. Generated PDFs are saved in the '$output_dir' folder."
