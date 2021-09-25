#! /bin/bash
echo Release version: 
read version

sudo docker login
sudo docker build -t jbperidy/projection-transition-backend:RELEASE-$version .
sudo docker push jbperidy/projection-transition-backend:RELEASE-$version
sudo docker build -t jbperidy/projection-transition-backend:LATEST .
sudo docker push jbperidy/projection-transition-backend:LATEST