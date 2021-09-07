#! /bin/bash

sudo docker build -t jbperidy/projection-transition-backend:RELEASE-$1 .
sudo docker push jbperidy/projection-transition-backend:RELEASE-$1
sudo docker build -t jbperidy/projection-transition-backend:LATEST .
sudo docker push jbperidy/projection-transition-backend:LATEST