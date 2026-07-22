# Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] All secrets in environment variables
- [ ] HTTPS/TLS enabled
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Database passwords are strong
- [ ] Admin IDs configured
- [ ] CORS whitelist configured
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints

### Performance
- [ ] Database indexes created
- [ ] Queries optimized
- [ ] Caching strategy implemented
- [ ] Images optimized
- [ ] JavaScript minified
- [ ] CSS minified
- [ ] Gzip compression enabled

### Monitoring
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Logging configured
- [ ] Uptime monitoring set up
- [ ] Database backups configured
- [ ] Log rotation configured
- [ ] Performance monitoring set up

## Render.com Full Deployment

### Step 1: Prepare GitHub Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Production ready: All features complete"
git push origin main
```

### Step 2: Create Render Services

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Sign in with GitHub

2. **Create Web Service (Backend)**
   - Click "New+" → "Web Service"
   - Select your GitHub repository
   - Name: `novavest-server`
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Standard (or higher for production)

3. **Create PostgreSQL Database**
   - Click "New+" → "PostgreSQL"
   - Name: `novavest-db`
   - Database: `novavest_db`
   - User: `novavest_user`
   - Plan: Standard
   - Region: Same as server

4. **Create Web Service (Frontend)**
   - Click "New+" → "Web Service"
   - Select your GitHub repository
   - Name: `novavest-client`
   - Environment: Node
   - Build Command: `cd client && npm install && npm run build`
   - Start Command: `cd client && npm run preview`
   - Plan: Standard (or higher)

### Step 3: Configure Environment Variables

**For Backend Service:**

Go to Settings → Environment:

```
NODE_ENV=production
PORT=3000
TELEGRAM_BOT_TOKEN=your_bot_token
DATABASE_URL=postgresql://user:pass@host:5432/novavest_db
JWT_SECRET=your_32_character_secret_key
ADMIN_IDS=123456789,987654321
FRONTEND_URL=https://novavest-client.onrender.com
BACKEND_URL=https://novavest-server.onrender.com
LOG_LEVEL=info
MIN_DEPOSIT=1000
MAX_DEPOSIT=1000000
MIN_WITHDRAWAL=500
MAX_WITHDRAWAL=500000
REFERRAL_REWARD=500
DEFAULT_CURRENCY=NGN
```

**For Frontend Service:**

Go to Settings → Environment:

```
VITE_API_URL=https://novavest-server.onrender.com
```

### Step 4: Connect PostgreSQL

1. Go to backend service Settings
2. Click "Environment" → Add environment variable
3. Add DATABASE_URL from PostgreSQL service

```bash
# Format: postgresql://user:password@host:port/database
postgresql://novavest_user:password@host:5432/novavest_db
```

### Step 5: Initialize Database

1. Connect to your PostgreSQL database:
   ```bash
   psql postgresql://user:password@host:5432/novavest_db
   ```

2. Copy and paste contents of `database/init.sql`

3. Or run via Render:
   - SSH into the backend service
   - Run: `npm run db:init`

### Step 6: Deploy

1. Render will automatically deploy on push
2. Watch deployment logs in dashboard
3. Test endpoints once deployed

```bash
# Test health check
curl https://novavest-server.onrender.com/health

# Test API
curl https://novavest-server.onrender.com/api/investment/plans
```

## Domain Configuration

### 1. Register Domain
- Namecheap, GoDaddy, or your preferred registrar

### 2. Configure DNS

**For Render Services:**

1. Go to Service Settings → Domains
2. Add custom domain
3. Follow DNS configuration instructions
4. Point to Render's nameservers or add CNAME records

**Example DNS Records:**
```
api.novavest.com → novavest-server.onrender.com (CNAME)
app.novavest.com → novavest-client.onrender.com (CNAME)
```

### 3. SSL Certificate
- Render provides free SSL automatically
- HTTPS is enabled by default

## Telegram Bot Configuration

### 1. Create Bot with @BotFather

```
/start
/newbot
Name: NovaVest Bot
Username: novavest_bot
```

### 2. Set Webhook URL

```bash
curl -X POST https://api.telegram.org/botYOUR_TOKEN/setWebhook \
  -d "url=https://api.novavest.com/bot/webhook"
```

### 3. Set Bot Commands

```bash
curl -X POST https://api.telegram.org/botYOUR_TOKEN/setMyCommands \
  -H 'Content-Type: application/json' \
  -d '{
    "commands": [
      {"command": "start", "description": "Start the bot"},
      {"command": "balance", "description": "Check your balance"},
      {"command": "referral", "description": "Get referral code"},
      {"command": "investments", "description": "View investments"},
      {"command": "help", "description": "Show help"},
      {"command": "support", "description": "Get support"}
    ]
  }'
```

## Monitoring & Maintenance

### Daily Tasks
- Check error logs
- Monitor API response times
- Verify bot responsiveness
- Check database performance

### Weekly Tasks
- Review user feedback
- Check security alerts
- Performance analysis
- Database maintenance

### Monthly Tasks
- Security audit
- Dependency updates
- Database backup verification
- Analytics review
- Performance optimization

## Backup Strategy

### Automated Backups

**PostgreSQL on Render:**
- Automatic daily backups (7-day retention)
- Access via Render dashboard

**Manual Backup:**
```bash
pg_dump postgresql://user:pass@host:5432/db > backup.sql
gzip backup.sql
aws s3 cp backup.sql.gz s3://your-bucket/backups/
```

### Restore from Backup
```bash
gunzip backup.sql.gz
psql postgresql://user:pass@host:5432/db < backup.sql
```

## Scaling Strategy

### Phase 1: Initial Launch (1-1000 users)
- Single server instance
- Standard PostgreSQL
- CDN for static assets

### Phase 2: Growth (1000-10000 users)
- Scale-up server (Pro plan)
- Read replicas for database
- Redis caching
- Separate admin service

### Phase 3: Enterprise (10000+ users)
- Load balancer
- Multiple server instances
- Database clustering
- Dedicated admin service
- Separate worker service for background jobs
- CDN for all assets

## Troubleshooting

### Server won't start
```bash
# Check logs
render logs -n 50

# Verify environment variables
# Check database connection
```

### Database connection errors
```bash
# Test connection
psql $DATABASE_URL

# Check if service is running
# Verify IP whitelist settings
```

### High latency
- Check database query logs
- Review slow query log
- Optimize expensive queries
- Add caching layer

### Out of memory
- Check error logs for memory leaks
- Scale up server plan
- Implement caching
- Optimize database queries

## Support

For deployment issues:
- Check Render documentation: https://render.com/docs
- Review logs in Render dashboard
- Contact Render support
- Check GitHub issues
