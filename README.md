# Installation locale (dev)
```
Degit the project
$ npx degit jperidy/projectionTransition newProjectName

Or clone it
$ git clone https://github.com/jperidy/projectionTransition newProjectName

Install the dependencies
$ npm install
```
## Ajout des variables d'environement (fichier config.json)
Ajouter dans le dossier /src le fichier config.json suivant :
```
// /src/config.json //

{
    "SVELTE_ENV": "production",
    "API_URL": "http://localhost:3000",
    "JWT_SECRET": "your_secret",
    "MONGO_URI": "mongodb+srv://<user>:<password>@<host>/databasename?retryWrites=true&w=majority",
    "CONTACT_EMAIL": "contact@gmail.com",
    "DEV_EMAIL": "dev@gmail.com",
    "MAIL_HOST": "smtp.gmail.com",
    "MAIL_PORT": "587",
    "MAIL_USER": "user@mail.com",
    "MAIL_PASS": "password"
}

```

- SVELTE_ENV: choisir l'environnement entre "dev" ou "production"
- API_URL: port sur lequel est exposée l'application
- JWT_SECRET: secret pour encoder les mots de passes des utilisateurs
- MONGO_URI: URI de la BDD MongoDB
- CONTACT_EMAIL: adresse de contact
- DEV_EMAIL: adresse de support
- MAIL_HOST: serveur SMTP
- MAIL_PORT: port SMTP
- MAIL_USER: login du compte mail
- MAIL_PASS: password du compte mail


### Création du fichier mains.min.css
Dans le répertoire /static ajouter votre feuille de style bootstrap customisée et donner lui le nom mains.min.css.

## Appliquer les migrations
```
migrate-mongo up
```
> En prérequis npm install -g migrate-mongo
## Si besoin, pour créer un fichier de migration
```
migrate-mongo create file_name
```

## Commandes pour lancer l'application depuis la racine du répertoire
A la racine :
```
$ npm run sass >> générer le css de l'application
$ npm run dev >> pour lancer l'application en dev
$ npm run build >> pour builder l'application
$ npm run start >> pour lancer l'application après avoir été buildée
```
# Déployer l'application sans docker

## Installer un gestionnaier de processus sur votre serveur
```
npm install pm2@latest -g
```

## Démarrer l'application
### Démarrer
```
npm run build
HOST=127.0.0.1 PORT=3000 pm2 start build/index.js
```
Modifier les variables d'environnement HOST et PORT pour changer l'exposition sur votre serveur de l'application.

### Arrêter
```
pm2 stop index
```

# Déployer l'application avec docker
## Créer l'image docker pour le backend

```
. docker-build
```
- Répondez aux questions pour configurer le repository sur dockerhub.
- Vous pouvez modifier le build en éditant le fichier /Dockerfile

## Créer l'image docker pour le frontend-sveltekit
```
cd frontend-sveltekit
. docker-build
```
- Réponsez aux questions pour configurer le repository sur dockerhub.
- Vous pouvez modifier le build en éditant le fichier /frontend-sveltekit/Dockerfile

## Préparer votre serveur (cas d'un VPS)
- Installer nginx et le configurer
- Configurer un proxy backend sur le nginx 
```
cd vps-admin
. create-proxy-backend.bash
```
- Configurer un proxy frontend sur le nginx 
```
cd vps-admin
. create-proxy-frontend.bash
```
- Créer le fichier config.json du backend dans le répertoire /config (à la racine de votre projet) et le compléter.

## Deployer et lancer vos dockers sur le serveur
Editer le fichier docker-compose.yml pour tout besoin de modification du paramétrage. Pensez notamment à bien renseigner le volume où se trouve votre fichier backend config.json.

```
. docker-start.bash
```

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


# Usage du back-office (BO)
## Générale
Une fois connecté au BO, un bandeau en haut est disponible sur toutes les pages. Il vous permet :
- de passer en mode édition
- de vous déconnecter
Si vous êtres en mode édition, une boite d'édition apparait lorsque votre souris survole les composants.
## Markdown
Les zone éditables utilisent les markown et permettent de faire une mise en forme simple.
- Italique : \**texte en italique*\*
- Gras : \*\***texte en gras**\*\*
- Italique et gras : \*\*\****texte en italique et gras***\*\*\*
- Titre 1 : # Titre 1
- Titre 2 : ## Titre 2
- ...
- Ajouter une ligne : passer à la ligne et ***
- Paragraphe : ajouter une ligne vierge pour ajouter un paragraphe
- Lien hypertexte : \[lien hypertexte\]\(https://lien.com\)
- Autres possibilités ici : [utilisation des markdown](https://www.ionos.fr/digitalguide/sites-internet/developpement-web/markdown/)

## Dimensions à privilégier pour les images (largeur x hauteur)
Privilégier le format jpeg ou jpg pour réduire la taille des documents
- Photos équipe : 400 x 300 px
- Images partenaires : 200 x 200 px
- Images pour carousel : 1000 x 500 px
- Images pour Programmation : 1000 x 600 px

La taille maximale acceptée pour une image est 1 Mb
## Dimensions à privilégier pour les vidéos
La taill maximale acceptée pour une vidéo est 100 Mb