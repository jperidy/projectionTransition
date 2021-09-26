#!/bin/bash

export PATH=/bin:/usr/bin:/usr/local/bin
TODAY=`date +"%d%b%Y"`
 
######################################################################
######################################################################

DB_BACKUP_PATH=$(pwd)'/_backup-mongodb'

echo "Enter Mongo URI to restore with auth: "
read MONGO_URI


mongorestore --uri ${MONGO_URI} --drop ${DB_BACKUP_PATH}/${TODAY}
