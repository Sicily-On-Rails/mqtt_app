#!/bin/bash

# Usage
# use 's' to deploy to stable, use 't' to deploy to test.


#
# Variables
#

CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
USER="admin"
SERVER="188.226.224.201"


#
# Script
#

if [[ $# != 1 ]]; then
    echo "Error: wrong number of arguments"
    echo "Usage: ./deploy.sh <option>"
    echo "Options: 's' to deploy to stable, use 't' to deploy to test."
    exit -1
fi

if [ $1 == "s" ]; then
    if [ "$CURRENT_BRANCH" != "master" ]; then
        echo "You're not on branch 'master'"
        exit -1
    fi
    REMOTE_PATH="/home/admin/conferenza_30_marzo"
elif [ $1 == "t" ]; then
    REMOTE_PATH="/home/admin/conferenza_30_marzo"
else
    echo "Invalid option!"
    echo "Usage: ./deploy.sh <option>"
    echo "Options: 's' to deploy to stable, use 't' to deploy to test."
fi

echo "Cleaning up..."
rm -rf mqtt_app
git clone https://github.com/Sicily-On-Rails/mqtt_app.git
echo "Clone to $REMOTE_PATH ..."
rsync -avhz -c --delete mqtt_app/ $USER@$SERVER:"$REMOTE_PATH"

echo "Deployed to $REMOTE_PATH !"
