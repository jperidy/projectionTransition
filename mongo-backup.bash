#!/bin/bash
 
######################################################################
##
##   MongoDB Database Backup Script 
##   Written By: Rahul Kumar
##   URL: https://tecadmin.net/shell-script-backup-mongodb-database/
##   Update on: June 20, 2020
##   Adapted By : Jean-Bernard PERIDY, on September 26, 2021
##
######################################################################
 
export PATH=/bin:/usr/bin:/usr/local/bin
TODAY=`date +"%d%b%Y"`
 
######################################################################
######################################################################

DB_BACKUP_PATH=$(pwd)'/_backup-mongodb'

echo "Enter Mongo URI to backup with auth: "
read MONGO_URI
 
echo Names to database to backup with space or 'ALL'
read DATABASE_NAMES
#DATABASE_NAMES='mydb db2 newdb'
 
## Number of days to keep local backup copy
BACKUP_RETAIN_DAYS=30   
 
######################################################################
######################################################################
 
mkdir -p ${DB_BACKUP_PATH}/${TODAY}
 
if [ ${DATABASE_NAMES} = "ALL" ]; then
 echo "You have choose to backup all databases"
 mongodump --forceTableScan --uri ${MONGO_URI} --out ${DB_BACKUP_PATH}/${TODAY}/
else
 echo "Running backup for selected databases"
 for DB_NAME in ${DATABASE_NAMES}
 do
 mongodump --forceTableScan --uri ${MONGO_URI}/${DB_NAME} --out ${DB_BACKUP_PATH}/${TODAY}/
 done
fi
 
 
######## Remove backups older than {BACKUP_RETAIN_DAYS} days  ########
 
DBDELDATE=`date +"%d%b%Y" --date="${BACKUP_RETAIN_DAYS} days ago"`
 
if [ ! -z ${DB_BACKUP_PATH} ]; then
      cd ${DB_BACKUP_PATH}
      if [ ! -z ${DBDELDATE} ] && [ -d ${DBDELDATE} ]; then
            rm -rf ${DBDELDATE}
      fi
      cd '../'
fi
 
######################### End of script ##############################