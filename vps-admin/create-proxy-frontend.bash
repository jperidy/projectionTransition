#! /bin/bash

echo 'start create_new_site'
sudo mkdir -p "/var/www/$1.jprdev.ovh/html"
sudo chown -R $USER:$USER "/var/www/$1.jprdev.ovh/html"
sudo chmod -R 755 "/var/www/$1.jprdev.ovh"
sudo echo "<h1>Welcome</h1>" > "/var/www/$1.jprdev.ovh/html/index.html"
sudo echo "server {
    root /var/www/$1.jprdev.ovh/html;
    server_name $1.jprdev.ovh www.$1.jprdev.ovh;
    location / {
        proxy_pass http://localhost:$2;
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
}" > "/etc/nginx/sites-available/$1.jprdev.ovh"
sudo ln -s "/etc/nginx/sites-available/$1.jprdev.ovh" "/etc/nginx/sites-enabled/"
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d "$1.jprdev.ovh" -d "www.$1.jprdev.ovh"