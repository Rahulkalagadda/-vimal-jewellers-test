# 🚀 Deployment Guide: Ubuntu + Apache + Node.js

This guide explains how to deploy the Vimal Jewellers Backend on an Ubuntu server using Apache as a reverse proxy and PM2 for process management.

## 1. Prerequisites
- Ubuntu Server (20.04 or 22.04 LTS)
- Root/Sudo access
- Domain name pointed to the server IP (e.g., `api.vimaljewellers.com`)

## 2. Server Setup (First Time Only)

Update system and install necessary tools:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install apache2 nodejs npm git certbot python3-certbot-apache -y
```

**Install Node.js (Latest stable version usually required):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Install PM2 (Process Manager):**
```bash
sudo npm install -g pm2
```

## 3. Application Setup

Clone your repository (or upload files):
```bash
# Example
git clone https://github.com/StartWars1/vimal-jewellers-test.git backend
cd backend
```

Install Dependencies:
```bash
# Root dependencies
npm install

# Backend service dependencies
cd services/backend
npm install
cd ../..
```

Setup Environment Variables:
```bash
# Create .env file
nano .env

# Paste your production variables:
# PORT=7502
# DATABASE_HOST=...
# DATABASE_USER=...
# DATABASE_PASSWORD=...
# NODE_ENV=production
```

## 4. Run the Application with PM2

We have created an `ecosystem.config.cjs` file for you. Start the app:

```bash
# Start the app
pm2 start ecosystem.config.cjs

# Save the list so it restarts on reboot
pm2 save
pm2 startup
```

## 5. Configure Apache Reverse Proxy

Enable proxy modules:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
```

Create a new configuration file (Copy the content of `apache-vhost.conf` from the repo):
```bash
sudo nano /etc/apache2/sites-available/vimal-backend.conf
```

**Content to Paste:**
```apache
<VirtualHost *:80>
    ServerName api.yourdomain.com

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://127.0.0.1:7502/
    ProxyPassReverse / http://127.0.0.1:7502/

    ErrorLog ${APACHE_LOG_DIR}/api-error.log
    CustomLog ${APACHE_LOG_DIR}/api-access.log combined
</VirtualHost>
```

Enable the site and restart Apache:
```bash
sudo a2dissite 000-default.conf  # Optional: Disable default
sudo a2ensite vimal-backend.conf
sudo systemctl restart apache2
```

## 6. Secure with SSL (HTTPS)

Run Certbot to automatically configure SSL certificates:
```bash
sudo certbot --apache -d api.yourdomain.com
```

Select "2" to Redirect HTTP to HTTPS automatically.

## 7. Monitoring & Logs

- **Check App Status:** `pm2 status`
- **View App Logs:** `pm2 logs`
- **View Apache Logs:** `tail -f /var/log/apache2/api-error.log`
