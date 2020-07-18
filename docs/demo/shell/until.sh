#!/bin/bash
# using the until command

num=100

until [ $num -eq 0 ]
do
    echo $num
    num=$[ $num - 25 ]
done