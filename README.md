# Version de démonstration

https://dev.projtran.jprdev.ovh/

# Installation locale (dev)
```
> git clone https://github.com/jperidy/projectionTransition
> npm install
> cd frontend-sveltekit 
> npm install
```
## Configuration du backend (config.json)
A la racine du projet créer le fichier config.json et le compléter avec les variables suivantes :  
```
// config.json //
{
    "NODE_ENV": "dev",  // choisir entre dev, preprod ou production
    "JWT_SECRET": "", // clé aléatoire pour le secret
    "MONGO_URI_DEV": "mongodb+srv://<name>:<password>@<database>",
    "MONGO_URI_PREPROD": "mongodb+srv://<name>:<password>@<database>",
    "MONGO_URI_PROD": "mongodb+srv://<name>:<password>@<database>",
    "CONTACT_EMAIL": "name@mail.com", // email qui doit recevoir les demandes des clients
    "MAIL_HOST": "smtp.gmail.com", // si gmail
    "MAIL_PORT": "587", // si gmail
    "MAIL_USER": "compte@mail.com", // email du compte qui envoit les emails
    "MAIL_PASS": "" // mot de passe du compte qui envoir les emails
}
```
## Configuration du frontend
Dans le docker frontend-sveltekit/src/ créer le fichier config.json et le compléter avec les variables suivantes :
```
// fontend-sveltekit/src/config.json //
{
    "SVELTE_ENV": "production", // choisir entre dev, preprod ou production
    "API_URL_DEV": "http://localhost:5000", // url de l'API si SVELTE_ENV = 'dev'
    "API_URL_PREPROD": "https://dev.projtranapi.jprdev.ovh", // url de l'API si SVELTE_ENV = 'preprod'
    "API_URL_PROD": "https://dev.projtranapi.jprdev.ovh", // url de l'API si SVELTE_ENV = 'prod'
    "SITE_URL_DEV": "https://localhost:3000",  // url du site si SVELTE_ENV = 'dev' (utile pour les open graphe)
    "SITE_URL_PREPROD": "https://dev.projtran.jprdev.ovh",  // url du site si SVELTE_ENV = 'dev' (utile pour les open 
    graphe)
    "SITE_URL_PROD": "https://dev.projtran.jprdev.ovh"  // url du site si SVELTE_ENV = 'dev' (utile pour les open graphe)
}
```
## Commandes pour lancer l'application depuis la racine du répertoire
A la racine :
```
> npm run start >> pour lancer le backend
> npm run server >> pour lancer le backend avec nodemon
> npm run client >> pour lancer le frontend
> npm run dev >> pour lancer simultanément le frontend et le backend avec nodemon
```
# Déployer l'application sans docker

[TODO]

# Déployer l'application avec docker

## Générer le docker pour le backend
Ouvrir le fichier docker-build.bash et changer le nom du repo dockerhub
> $ . docker-build <version>
Par défaut le backend sera exposé sur le port 5000.
### Attention Sécurité
Votre fichier config.json contient des informations sensibles. Le script pousse automatiquement l'image du docker sur dockerhub. Assurez vous que ce répertoire est privé ou supprimez les lignes push.

## Générer le docker pour le frontend
Ouvrir le fichier frontend-sveltekit/docker-build.bash et changer le nom du repo dockerhub

Ouvrir le fichier frontend-sveltekit/source/config/backend_api.js et modifier l'url à laquelle sera joignable votre backend
> $ . docker-build <version>
Par défaut le frontend sera exposé sur le port 80 (servi par un nginx dont la configuration est disponible dans frontend/nginx)

## Préparer votre serveur (cas d'un VPS)
- Installer nginx et le configurer
- Configurer un proxy backend sur le nginx > $ . create-proxy-backend.bash <domain> <port>
- Configurer un proxy frontend sur le nginx > $ . create-proxy-frontend.bash <domain> <port>

## Deployer et lancer vos dockers sur le serveur
Editer le fichier docker-compose.yml pour tout besoin de modification du paramétrage
>$ . docker-start.bash

# Migrer les données de la préprod vers la production

## Avec Docker
### Backuper et restaurer les données du volume
- Aller sur l'environnement où tourne votre docker de préproduction et lancer le script docker-volume-backup.bash
- Récupérer le fichier .tar généré dans le dossier /backup
- Créer un doccier _backup-volume sur l'environnement où vous souhaitez restaurer votre volume
- Créer et exécuter le fichier suivant
```
sudo docker rm -f `sudo docker ps -aq -f name=projection-transition*`
sudo docker rmi --force `sudo docker images --filter=reference="jbperidy/projection-transition*:*" -q`
sudo docker volume rm projection-transition_projection-transition-data --force
sudo docker-compose -p "projection-transition" up -d
sudo docker run --rm --volumes-from projection-transition-backend -v $(pwd)/_backup-volume:/backup ubuntu bash -c "cd /app && tar xvf /backup/backup-projection-transition-volume.tar --strip 1"
```
### Backuper et restaurer les données de la base MongoDB
[TODO]

## Sans Docker
### Backuper et restaurer les données de dossier racine uploads
### Backuper et restaurer les données de la base MongoDB

# Autres

## Dimensions à privilégier pour les images
- Photos équipe : 400 x 300 px
- Images partenaires : 400 x 400 px
- Images pour carousel : 1000 x 500 px