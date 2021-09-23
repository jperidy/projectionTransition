#! /bin/bash

sudo docker build -t jbperidy/projection-transition-frontend-sveltekit:RELEASE-$1 .
sudo docker push jbperidy/projection-transition-frontend-sveltekit:RELEASE-$1
sudo docker build -t jbperidy/projection-transition-frontend-sveltekit:LATEST .
sudo docker push jbperidy/projection-transition-frontend-sveltekit:LATEST