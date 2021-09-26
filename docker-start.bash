#! /bin/bash

echo 'start docker-compose'

sudo docker login
sudo docker rm -f `sudo docker ps -aq -f name=projection-transition*`
sudo docker rmi --force `sudo docker images --filter=reference="jbperidy/projection-transition*:*" -q`

sudo docker-compose -p "projection-transition" up -d