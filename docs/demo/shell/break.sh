#!/bin/bash
# breaking out of a for loop

for num in 1 2 3 4 5 6 7 8 9 10
do
  if [ $num -eq 5 ]
  then
    break
  fi
  echo "Iteration number: $num"
done
echo "The for loop is completed"