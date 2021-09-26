# Version de démonstration

https://dev.projtran.jprdev.ovh/

# Installation locale (dev)
```
git clone https://github.com/jperidy/projectionTransition
npm install
cd frontend-sveltekit 
npm install
```
## Configuration du backend (config.json)
A la racine du projet créer le fichier config.json et le compléter avec les variables suivantes :  
```
// config.json //
{
    "NODE_ENV": "dev",  // choisir entre "dev", "preprod" ou "production"
    "JWT_SECRET": "", // clé aléatoire pour le secret d'authentification admin
    "MONGO_URI_DEV": "" // on cloud : "mongodb+srv://<userName>:<password>@<dbHost>/<dbName>" or local mongodb://<userName>:<password>@localhost:<port>/<dbName>
    "MONGO_URI_PREPROD": "", // même format que MONGO_URI_DEV
    "MONGO_URI_PROD": "", // même format que MONGO_URI_DEV
    "CONTACT_EMAIL": "name@mail.com", // email qui doit recevoir les demandes des clients
    "MAIL_HOST": "smtp.gmail.com", // si gmail
    "MAIL_PORT": "587", // si gmail
    "MAIL_USER": "compte@mail.com", // email du compte qui envoit les emails
    "MAIL_PASS": "" // mot de passe du compte qui envoir les emails
}
```
### Attention sécurité
Le fichier config.json contient des informations sensibles à ne pas exposer directement sur internet, assurez vous d'ajouter ce fichier dans votre .gitignore
## Configuration du frontend
Dans le docker frontend-sveltekit/src/ créer le fichier config.json et le compléter avec les variables suivantes :
```
// fontend-sveltekit/src/config.json //
{
    "SVELTE_ENV": "production", // choisir entre "dev", "preprod" ou "production"
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
# Déployer l'application sans docker (Attention non testé)

## Installer un gestionnaier de processus

>npm install pm2@latest -g

## Démarrer le backend

Démarrer
>pm2 start backend/server.js
Arrêter
>pm2 stop server

## Démarrer le frontend
̀̀Démarrer
>cd frontend-sveltekit
>npm run build
>pm2 start build/index.js
Arrêter
>pm2 stop index

# Déployer l'application avec docker

## Créer l'image docker pour le backend
Ouvrir le fichier docker-build.bash et changer le nom du repo dockerhub
> $ . docker-build <version>
Par défaut le backend est exposé sur le port 5000.
### Attention Sécurité
Votre fichier config.json contient des informations sensibles. Le script pousse automatiquement l'image du docker sur dockerhub. Assurez vous que ce répertoire est privé ou supprimez les lignes push.

## Créer l'image docker pour le frontend-sveltekit
Ouvrir le fichier frontend-sveltekit/docker-build.bash et changer le nom du repo dockerhub
>. docker-build <version>
Le frontend est exposé sur le port 3000

## Préparer votre serveur (cas d'un VPS)
- Installer nginx et le configurer
- Configurer un proxy backend sur le nginx 
>cd vps-admin
>. create-proxy-backend.bash
- Configurer un proxy frontend sur le nginx 
>cd vps-admin
>. create-proxy-frontend.bash

## Deployer et lancer vos dockers sur le serveur
Editer le fichier docker-compose.yml pour tout besoin de modification du paramétrage
>. docker-start.bash

# Migrer les données de la préprod vers la production

## Backuper et restaurer les données du volume Docker (cas spécifique à l'usage de docker en production)
- Aller sur l'environnement où tourne votre docker de préproduction (ENV_PREPROD) et lancer le script docker-volume-backup.bash. Ce script va automatiquement créer une archive dans le répertoire $(pwd)/backup.
- Récupérer le fichier .tar généré dans le dossier /backup
- Créer un doccier _backup-volume sur l'environnement où vous souhaitez restaurer votre volume (ENV_PROD)
- Exécuter le script docker-restore-backup.bash
    - Le script vous demande les informations de connexion pour se connecter à l'environnement où se trouve votre archive (ENV_PREPROD)
    - Le script vous demande le chemin où se trouve l'archive dans l'environnement (ENV_PREPROD)
    - Le script vous demande le nom de l'archive à restorer dans l'environnement (ENV_PREPROD)
    - Le script copie l'archive dans votre répertoire _backup-volume dans l'environnement (ENV_PROD)
    - Le script copie le volume de la préprod dans le volume de la production

## Backuper et restaurer les données de la base mongoDB
- Aller dans votre environnement de production (ENV_PROD)
- Lancer le script mongo-backup.bash pour récupérer un dump de la base de donnée de préproduction
    - Le script vous demandera l'URI pour vous connecter à la DB de préproduction
    - Le script vous demandera le ou les nom des bases de données à dumper
        - ALL : pour prendre toutes les bases de données
        - nom : pour une seule base
        - nom1, nom2 : pour plusieurs bases
    - Le script ajoutera l'archive dans le répertoire _backup-mongodb/dateActuelle/
- Lancer ensuite le script mongo-restore.bash
    - Le script vous demandera l'URI pour vous connecter à la DB de production.
    - Le script retorera les données sur base du dump du jour.
    - Point d'attention : pour restorer un autre dump adaptez le script

## Backuper et restaurer les données du serveur sans Docker (cas spécifique au non usage de Docker en production)
- Aller sur l'environnement où tourne votre docker de préproduction (ENV_PREPROD) et lancer le script docker-volume-backup.bash. Ce script va automatiquement créer une archive dans le répertoire $(pwd)/backup.
- Récupérer le fichier .tar généré dans le dossier /backup
- Décompresser cette archive
- copier tout ce qui se trouve dans le répertoire /app (donc le répertoire uploads)
- coller ce répertoire (uploads) à la racine du projet


# Autres
## Dimensions à privilégier pour les images
- Photos équipe : 400 x 300 px
- Images partenaires : 400 x 400 px
- Images pour carousel : 1000 x 500 px