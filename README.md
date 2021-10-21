# Version de démonstration

https://dev.projtran.jprdev.ovh/

# Installation locale (dev)
```
Degit the project
$ npx degit jperidy/projectionTransition newProjectName

Or clone it
$ git clone https://github.com/jperidy/projectionTransition newProjectName

Install the dependencies
$ npm install
$ cd frontend-sveltekit 
$ npm install
```
## Configuration du backend (config.json)
A la racine du projet créer le dossier /config et insérer dedans le fichier config.json suivant :  
```
// /config/config.json //
{
    "NODE_ENV": "dev",
    "VERSION": "0.0.1",
    "PORT": 5000, 
    "JWT_SECRET": "", 
    "MONGO_URI_DEV": "",
    "MONGO_URI_PREPROD": "",
    "MONGO_URI_PROD": "",
    "CONTACT_EMAIL": "name@mail.com",
    "DEV_EMAIL": "name@mail.com",
    "MAIL_HOST": "smtp.gmail.com", 
    "MAIL_PORT": "587", 
    "MAIL_USER": "compte@mail.com", 
    "MAIL_PASS": ""
}
```
Description des différents attributs du fichier config.json

- NODE_ENV : choisir entre "dev", "preprod" ou "production"
- VERSION : numéro de version de votre backend
- PORT : numéro de port sur lequel sera exposé le backend
- JWT_SECRET : Clé aléatoire pour le secret d'authentification JWT (choisir une valeure et ne plus la changer)
- MONGO_URI_DEV : utilisé si NODE_ENV = dev
    - MongoDB en SaaS : mongodb+srv://<userName>:<password>@<dbHost>/<dbName> 
    - MongoDB en local : mongodb://<userName>:<password>@localhost:<port>/<dbName>
- MONGO_URI_PREPROD : utilisé si NODE_ENV = preprod (format équivalent à ci-dessus)
- MONGO_URI_PROD : utilisé si NODE_ENV = prod (format équivalent à ci-dessus)
- CONTACT_EMAIL : email vers qui sera envoyé les mails dans le formulaire de contatcs
- DEV_EMAIL : email vers qui sera envoyé les mails adressés au développeur
- MAIL_HOST : serveur smtp (ex. smtp.gmail.com)
- MAIL_PORT : port smtp (ex. 587)
- MAIL_USER : compte utilisateur pour envoyer les mails
- MAIL_PASS : mot de passe applicatif pour envoyer les mails

### Attention sécurité
Le fichier /config/config.json contient des informations sensibles à ne pas exposer directement sur internet, assurez vous d'ajouter ce fichier dans votre .gitignore et .dockerignore (le cas échéant).

## Configuration du frontend
### Création du fichier config.json
Dans le docker frontend-sveltekit/src/ créer le fichier config.json suivant :
```
// fontend-sveltekit/src/config.json //

{
    "SVELTE_ENV": "production",
    "VERSION": "0.0.4",
    "API_URL_DEV": "http://localhost:5000",
    "API_URL_PREPROD": "https://dev.projtranapi.jprdev.ovh",
    "API_URL_PROD": "https://dev.projtranapi.jprdev.ovh",
    "SITE_URL_DEV": "https://localhost:3000",
    "SITE_URL_PREPROD": "https://dev.projtran.jprdev.ovh",
    "SITE_URL_PROD": "https://dev.projtran.jprdev.ovh",
    "NAV_BAR": {
        "TITLE": [
            {"name": "Display name", "url": "/path", "SUBTITLE": []},
        ],
        "BRAND": {
            "LOGO": {
                "path": "/images/Logo_Principal.jpg", 
                "alt": "Logo de votre marque", 
                "style": "max-width: 20vh; height:auto;"
            },
            "NAME": ""
        },
        "SOCIAL_NETWORKS": [
            {"name": "facebook", "icon": "/icones/FB.004.png", "alt": "icone pour être redirigé vers FB", "redirect": "/facebook", "target": "_blank"},
        ],
        "STYLE": {
            "expand": "xl",
            "color": "white",
            "theme": "light",
            "TITLE": { "bootstrapClass": "text-dark mx-2", "style": "font-family: omotenashi_2regular;font-size: 1.3rem;" },
            "SOCIAL_NETWORKS": { "bootstrapClass": "", "style": "max-width: 6vh;height: auto;"}
        }
    },
    "FOOTER": {
        "TYPE": {
            "navigation": true,
            "copyright": true
        },
        "BRAND": {
            "LOGO": {
                "path": "/images/Logo_Principal.jpg", 
                "alt": "Logo de votre marque pour remonter en haut de page",
                "style" : "width: 100%; max-width:130px;"
            },
            "NAME": ""
        },
        "TITLE": [
            {"name": "QUI SOMMES-NOUS", "url": "/qui-sommes-nous#up", "SUBTITLE": []},
        ],
        "SOCIAL_NETWORKS": [
            {"name": "facebook", "icon": "/icones/FB.004.png", "alt": "icone pour consulter la page Facebook", "redirect": "https://www.facebook.com/yourMarque/", "target": "_blank"},
        ],
        "COPYRIGHT": {
            "value": "©2021 Votre marque",
            "style": "ont-size:1rem;",
            "bootstrapClass": "mx-3"
        },
        "STYLE": {
            "FOOTER": {"bootstrapClass": "bg-white text-dark align-items-center" , "style": ""},
            "NAVIGATION": {"bootstrapClass": "row bg-white text-dark align-items-center px-3 py-2 " , "style": "min-height:15vh;"},
            "COPYRIGHT": {"bootstrapClass": "row align-items-center my-1" , "style": ""},
            "TITLE": {"bootstrapClass": "mx-3 fw-bold", "style": "font-size:1rem;cursor:pointer;"},
            "SOCIAL_NETWORKS" : {"bootstrapClass": "", "style" : "max-width: 7vh;height: auto;"}
        }
    },
    "SEO": {
        "DEFAULT_TITLE": "My app name",
        "DEFAULT_DESCRIPTION": "My app name - what I am doing",
        "DEFAULT_OG_TITLE": "My app name - what I am doing",
        "DEFAULT_OG_DESCRIPTION": "Information on my app",
        "DEFAULT_OG_IMAGE": "/images/og_logo.jpg"
    },
    "SHEETS": {
        "FAVICON": {
            "_48_48": {"path": "/favicon_48x48.png"},
            "_64_64": {"path": "/favicon_64x64.png"},
            "_96_96": {"path": "/favicon_96x96.png"},
            "_128_128": {"path": "/favicon_128x128.png"},
            "_196_196": {"path": "/favicon_196x196.png"}
        }
    }
}

```

- SVELTE_ENV: choisir l'environnement entre "dev", "preprod" ou "production"
- VERSION : numéro de version de votre application frontend
- API_URL_DEV : url de l'API si SVELTE_ENV = 'dev' (ex. "http://localhost:5000")
- API_URL_PREPROD : url de l'API si SVELTE_ENV = 'preprod' (ex. "https://preprod.monprojetapi.ovh") 
- API_URL_PROD : url de l'API si SVELTE_ENV = 'production' (ex. "https://monprojetapi.ovh")
- SITE_URL_DEV : url du site web si SVELTE_ENV = 'dev' (ex. "https://localhost:3000")
- SITE_URL_PREPROD : url du site web si SVELTE_ENV = 'preprod' (ex. "https://preprod.monprojet:3000")
- SITE_URL_PROD : url du site web si SVELTE_ENV = 'dev' (ex. "https://monprojet.ovh")
- NAV_BAR : Description de la balise de navigation de l'application
    - TITLE : Array pour décrire les onglets de navigation
        - name : nom à affichier
        - url : adresse de la page
        - SUBTITLE : pas encore implémenté si besoin de sous onglets de navigation
    - BRAND : Objet pour ajouter votre marque dans la navigation
        - LOGO : {
                    "path": "/images/Logo_Principal.jpg", 
                    "alt": "Logo de votre marque pour remonter en haut de page",
                    "style" : "width: 100%; max-width:130px;"
                },
        - NAME : "Nom de votre marque" (laisser vide si vous ne souhaitez pas l'afficher)
    - SOCIAL_NETWORKS : Array pour décrire les réseaux sociaux sur lesquels vous êtes présents et les afficher dans la navigation
    - STYLE : configuration du style de votre barre de navigation
- FOOTER : Description de la balise footer de l'application. Cette balise est découpée en deux objets :
    - TYPE : 
        - navigation : laisser à true pour l'afficher. Permet de naviguer vers des pages du site web (par exemple les mentions légales)
        - copyright : laisser à true pour l'afficher. Permet d'afficher un copyright en bas de page.
    - BRAND : permet d'ajouter votre marque en bas de page. Cette marque inclus un lien vers le haut de votre page pour faciliter la navigation.
    - TITLE : paramétrage des onglet si vous avez laissé TYPE.navigation à true
    - SOCIAL_NETWORKS : paramétrer les liens vers les réseaux sociaux si vous avez laissé TYPE.navigation à true
    - COPYRIGHT : paramétrer votre copyright si vous avez laiss TYPE.copyright à true
    - STYLE : paramétrage de différents styles de votre balise footer.
- SEO : Description par défaut de vos balises améliorant le SEO de votre page
- SHEETS.FAVICON : lien vers les images aux différents formats à charger.

### Création du fichier mains.min.css
Dans le répertoire /frontend-sveltekit/static ajouter votre feuille de style bootstrap customisée et donner lui le nom mains.min.css.

## Commandes pour lancer l'application depuis la racine du répertoire
A la racine :
```
$ npm run start >> pour lancer le backend
$ npm run server >> pour lancer le backend avec nodemon
$ npm run client >> pour lancer le frontend
$ npm run dev >> pour lancer simultanément le frontend et le backend avec nodemon
```
# Déployer l'application sans docker

## Installer un gestionnaier de processus sur votre serveur
```
npm install pm2@latest -g
```

## Démarrer le backend

```
Démarrer
$ pm2 start backend/server.js

Arrêter
$ pm2 stop server
```

## Démarrer le frontend
### Démarrer
```
cd frontend-sveltekit
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
- Réponsez aux questions pour configurer le repository sur dockerhub.
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