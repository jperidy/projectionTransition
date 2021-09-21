#! /bin/bash

echo 'start backup volume command'
sudo docker run --rm --volumes-from projection-transition-backend -v $(pwd)/backup:/backup ubuntu tar cvf /backup/backup-projection-transition-volume.tar /app/uploads/