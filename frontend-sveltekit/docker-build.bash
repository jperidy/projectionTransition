#! /bin/bash

echo Release version:
read version

sudo docker build -t jbperidy/projection-transition-frontend-sveltekit:RELEASE-$version .
sudo docker push jbperidy/projection-transition-frontend-sveltekit:RELEASE-$version
sudo docker build -t jbperidy/projection-transition-frontend-sveltekit:LATEST .
sudo docker push jbperidy/projection-transition-frontend-sveltekit:LATEST