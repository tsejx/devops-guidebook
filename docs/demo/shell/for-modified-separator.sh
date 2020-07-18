#/bin/bash
# reading values from a file

file="provinces2.txt"

IFS=$'\n'
for province in $(cat $file)
do
  echo "Visit beautiful $province"
done