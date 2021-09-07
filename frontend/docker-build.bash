#! /bin/bash

sudo docker build -t jbperidy/projection-transition-frontend:RELEASE-$1 .
sudo docker push jbperidy/projection-transition-frontend:RELEASE-$1
sudo docker build -t jbperidy/projection-transition-frontend:LATEST .
sudo docker push jbperidy/projection-transition-frontend:LATEST