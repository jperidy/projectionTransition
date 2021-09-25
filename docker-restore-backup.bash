#! /bin/bash

echo "Give <account>@<IP_address>"
read connexion

echo "Path where the .tar file is available on server:"
read path

echo "Archive name to restore:"
read archiveName

scp $connexion:/$path/$archiveName $(pwd)/_backup-volume

# Remove and recreate the volume
sudo docker rm -f `sudo docker ps -aq -f name=projection-transition*`
sudo docker rmi --force `sudo docker images --filter=reference="jbperidy/projection-transition*:*" -q`
sudo docker volume rm projection-transition_projection-transition-data --force

sudo docker login
sudo docker-compose -p "projection-transition" up -d

sudo docker run --rm --volumes-from projection-transition-backend -v $(pwd)/_backup-volume:/backup ubuntu bash -c "cd /app && tar xvf /backup/backup-projection-transition-volume.tar --strip 1"