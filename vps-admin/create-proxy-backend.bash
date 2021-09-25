#! /bin/bash

echo 'start create_new_site'

echo Subdomaine to create - <subdomaine>.jprdev.ovh: 
read subdomaine
echo Port to proxy
read port

sudo mkdir -p "/var/www/$subdomaine.jprdev.ovh/html"
sudo chown -R $USER:$USER "/var/www/$subdomaine.jprdev.ovh/html"
sudo chmod -R 755 "/var/www/$subdomaine.jprdev.ovh"
sudo echo "<h1>Welcome</h1>" > "/var/www/$subdomaine.jprdev.ovh/html/index.html"
sudo echo "server {
    root /var/www/$subdomaine.jprdev.ovh/html;
    server_name $subdomaine.jprdev.ovh www.$subdomaine.jprdev.ovh;
    location / {
        proxy_pass http://localhost:$port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade '$http_upgrade';
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host '$host';
        proxy_cache_bypass '$http_upgrade';
        gzip on;
        gzip_min_length 1000;
        gzip_proxied expired no-cache no-store private auth;
        gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml image/jpg image/jpeg image/png image/>
    }
    listen 80;
    listen [::]:80;
}" > "/etc/nginx/sites-available/$subdomaine.jprdev.ovh"
sudo ln -s "/etc/nginx/sites-available/$subdomaine.jprdev.ovh" "/etc/nginx/sites-enabled/"
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d "$subdomaine.jprdev.ovh" -d "www.$subdomaine.jprdev.ovh"