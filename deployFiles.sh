#!/bin/bash

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployFiles.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Building the React application.\n"
npm run build

if [[ $? -ne 0 ]]; then
    printf "\n----> Build failed. Deployment cancelled.\n"
    exit 1
fi

printf "\n----> Deploying files for $service to $hostname with $key\n"

printf "\n----> Clear out the previous distribution on the target.\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}/public
mkdir -p services/${service}/public
ENDSSH

printf "\n----> Copy the production build to the target.\n"
scp -r -i "$key" dist/* ubuntu@$hostname:services/$service/public