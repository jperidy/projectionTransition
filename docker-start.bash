#! /bin/bash

echo 'start docker-compose'
sudo docker rm -f `sudo docker ps -aq -f name=projection-transition*`
sudo docker rmi --force `sudo docker images --filter=reference="jbperidy/projection-transition*:*" -q`
set -a
source .env
echo "NODE_ENV = ${NODE_ENV}"
echo "MONGO_URI_DEV = ${MONGO_URI_DEV}"
echo "MONGO_URI_PROD = ${MONGO_URI_PROD}"
cat ${COMPOSE_CONFIG} | envsubst | sudo docker-compose -f - -p "projection-transition" up -d