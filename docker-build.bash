#! /bin/bash

echo Release version:
read version

echo Enter repository
read repository

sudo docker build -t $repository:RELEASE-$version .
sudo docker push $repository:RELEASE-$version
sudo docker build -t $repository:LATEST .
sudo docker push $repository:LATEST