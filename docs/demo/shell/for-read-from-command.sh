# !/bin/bash
# reading values from  a file

file="provinces.txt"

for province in $(cat $file)
do
  echo "Visit beautiful $province"
done