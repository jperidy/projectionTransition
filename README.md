# Version de démonstration
https://dev.projtran.jprdev.ovh/

# Installation locale (dev)
***
- $ git clone https://github.com/jperidy/projectionTransition
- $ npm install
- $ cd frontend npm install

## Créer les variables d'environnement
Créer à la racine un fichier .env et ajouter les variables suivantes :
- COMPOSE_CONFIG='docker-compose.yml' #variable utilisée par le script docker-start.bash
- NODE_ENV='dev'
- JWT_SECRET='******' #configurez votre secret pour JWT (n'importe qu'elle chaine tant que celle ci reste complexe)
- MONGO_URI_DEV='uri_vers_mongodb' #configurez votre uri de connexion à mongodb pour le dev (NODE_ENV='developpement')
- MONGO_URI_PROD='uri_vers_mongodb' #configurez votre uri de connexion à mongodb pour la prod (NODE_ENV='production')
- CONTACT_EMAIL='contact@mail.com' #adresse de messagerie qui recevra les messages de contact
- MAIL_HOST='smtp.gmail.com' #si vous utilisez un service GMAIL
- MAIL_PORT='587' #si vous utilisez un service GMAIL
- MAIL_USER='username@gmail.com' #adresse du compte qui émettra les mails
- MAIL_PASS='****' #mot de passe que l'application pourra utiliser pour s'authentifier

## Configurer le proxy du frontend pour appeler le backend
ouvrir le fichier : frontend/source/config/backend_api.js
- Si vous lancez le backend en local : $ export const API_URL = 'http://localhost:5000';
- Sinon indiquez l'url où appeler l'API du backend

## Lancer l'application
A la racine :
- $ npm run start >> pour lancer le backend
- $ npm run server >> pour lancer le backend avec nodemon
- $ npm run client >> pour lancer le frontend
- $ npm run dev >> pour lancer simultanément le frontend et le backend avec nodemon

# Déployer l'application avec docker

## Générer le docker pour le backend
Ouvrir le fichier docker-build.bash et changer le nom du repo dockerhub
- $ . docker-build <version>
Par défaut le backend sera exposé sur le port 5000.

## Générer le docker pour le frontend
Ouvrir le fichier frontend/docker-build.bash et changer le nom du repo dockerhub

Ouvrir le fichier frontend/source/config/backend_api.js et modifier l'url à laquelle sera joignable votre backend
- $ . docker-build <version>
Par défaut le frontend sera exposé sur le port 80 (servi par un nginx dont la configuration est disponible dans frontend/nginx)

## Préparer votre serveur (cas d'un VPS)
- Installer nginx et le configurer

- Configurer un proxy backend sur le nginx > $ . create-proxy-backend.bash <domain> <port>

- Configurer un proxy frontend sur le nginx > $ . create-proxy-frontend.bash <domain> <port>

## Créer les variables d'environnement
Créer le fichier .env avec les variables d'environnement suivantes :
- COMPOSE_CONFIG='docker-compose.yml' #variable utilisée par le script docker-start.bash
- NODE_ENV='production'
- JWT_SECRET='******' #configurez votre secret pour JWT (n'importe qu'elle chaine tant que celle ci reste complexe)
- MONGO_URI_PROD='uri_vers_mongodb' #configurez votre uri de connexion à mongodb pour la prod
- CONTACT_EMAIL='contact@mail.com' #adresse de messagerie qui recevra les messages de contact
- MAIL_HOST='smtp.gmail.com' #si vous utilisez un service GMAIL
- MAIL_PORT='587' #si vous utilisez un service GMAIL
- MAIL_USER='username@gmail.com' #adresse du compte qui émettra les mails
- MAIL_PASS='****' #mot de passe que l'application pourra utiliser pour s'authentifier

## Deployer et lancer vos dockers sur le serveur
$ . docker-start.bash
Editer le fichier docker-compose.yml pour tout besoin de modification du paramétrage

# Dimensions à privilégier pour les images
- Photos équipe : 400 x 300 px
- Images partenaires : 400 x 400 px