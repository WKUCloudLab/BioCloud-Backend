#!/bin/bash

OUTPUT=$(kubectl logs -l app=fastqc)

echo $OUTPUT

echo $1 $2
while($OUTPUT -ne "Analysis complete for $2.fq")
do
	$OUTPUT= $(kubectl logs -l app=$1)
	echo $OUTPUT
done

#mysql -u root -pUbuntu14.04 -e <<EOF


#USE BioCloud


#mysql 
