#! /bin/bash

echo 'start backup volume command'

prefix=backup-volume
suffixe=$(date +%s)

archiveName=${prefix}-${suffixe}.tar

sudo docker run --rm --volumes-from projection-transition-backend -v $(pwd)/backup:/backup ubuntu tar cvf /backup/${archiveName} /app/uploads/