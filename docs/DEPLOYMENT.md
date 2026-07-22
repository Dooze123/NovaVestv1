# Deployment Guide

## Render.com Deployment

### Prerequisites
- GitHub repository
- PostgreSQL database
- Telegram Bot Token

### Steps

1. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New+" → "Web Service"
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - In Render dashboard, go to Environment
   - Add the following variables:
     ```
     NODE_ENV=production
     TELEGRAM_BOT_TOKEN=your_token
     DATABASE_URL=postgresql://...
     JWT_SECRET=your_secret_key
     ADMIN_IDS=123456789,987654321
     ```

3. **Build Command**
   ```
   npm install && npm run build
   ```

4. **Start Command**
   ```
   npm start
   ```

5. **Deploy**
   - Push to GitHub - Render will automatically deploy

## Docker Deployment

### Local Development

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production with Docker

```bash
# Build production image
docker build -f Dockerfile.server -t novavest-server:latest .

# Push to registry
docker tag novavest-server:latest your-registry/novavest-server:latest
docker push your-registry/novavest-server:latest

# Deploy with docker-compose
docker-compose -f docker-compose.yml up -d
```

## Heroku Deployment (Alternative)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add buildpacks
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

## VPS Deployment (Ubuntu/Debian)

### 1. Install Prerequisites
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx
```

### 2. Setup PostgreSQL
```bash
sudo -u postgres createdb novavest_db
sudo -u postgres createuser novavest_user
sudo -u postgres psql
alter user novavest_user with password 'secure_password';
grant all privileges on database novavest_db to novavest_user;
```

### 3. Clone and Setup Application
```bash
cd /var/www
sudo git clone https://github.com/Dooze123/NovaVestv1.git
cd NovaVestv1
sudo npm install
sudo npm run build
```

### 4. Create Environment File
```bash
sudo cp .env.example .env
sudo nano .env  # Edit with your values
```

### 5. Setup PM2
```bash
sudo npm install -g pm2
pm2 start npm --name "novavest" -- start
pm2 startup
pm2 save
```

### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/novavest
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/novavest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### View Logs

**With PM2:**
```bash
pm2 logs novavest
```

**With Docker:**
```bash
docker-compose logs -f server
```

### Database Backup
```bash
pg_dump novavest_db > backup.sql

# Restore
psql novavest_db < backup.sql
```
