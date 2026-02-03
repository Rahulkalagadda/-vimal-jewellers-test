# Vimal Jewellers Backend - Railway Deployment Guide

## 🚀 Deployment Configuration

This backend is configured for deployment on Railway using the `railway.json` configuration file.

## 📋 Prerequisites

Before deploying to Railway, ensure you have:

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A MySQL database provisioned on Railway or another cloud provider
3. All required environment variables ready

## 🔧 Required Environment Variables

Set these environment variables in your Railway project:

```env
# Database Configuration (Aiven MySQL)
DATABASE_HOST=<your-aiven-mysql-host>
DATABASE_PORT=<your-database-port>
DATABASE_NAME=<your-database-name>
DATABASE_USER=<your-database-user>
DATABASE_PASSWORD=<your-database-password>
DATABASE_SSL=true

# Application Configuration
NODE_ENV=production
PORT=7502

# Frontend URL
FRONTEND_URL=https://vimal-jewellers-test.vercel.app/

# JWT Secret (generate a secure random string if not already set)
JWT_SECRET=<your-jwt-secret-key>

# Skip DB Sync in Production
SKIP_DB_SYNC=true
```

**Important Notes:**
- The database is already deployed on **Aiven Cloud**
- SSL is **required** for the Aiven MySQL connection
- Make sure to set `NODE_ENV=production` in Railway (currently set to development in local .env)
- Copy the actual credentials from your `.env` file when setting up Railway environment variables

## 📦 Deployment Steps

### Option 1: Deploy via Railway CLI

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize Railway project:
   ```bash
   railway init
   ```

4. Link to your Railway project:
   ```bash
   railway link
   ```

5. Deploy:
   ```bash
   railway up
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Configure for Railway deployment"
   git push digitalrise main
   ```

2. In Railway dashboard:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `digitalrisemarketingrk-wq/vimal-jewels-backend`
   - Railway will automatically detect the `railway.json` configuration

3. Add environment variables in Railway dashboard under "Variables" tab

4. Deploy!

## 🏗️ Build & Deploy Process

The `railway.json` configuration defines:

- **Build**: Uses NIXPACKS builder with `npm install`
- **Pre-Deploy**: Runs database migrations via `npm run db:migrate`
- **Start**: Launches the app with `node services/backend/index.js`
- **Health Check**: Monitors `/health` endpoint (timeout: 100ms)
- **Restart Policy**: Restarts `ON_FAILURE`

## 🔍 Health Check Endpoint

The backend includes a health check endpoint at `/health` that:
- Verifies database connectivity
- Returns application status
- Reports Node.js version

Example response:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "v18.x.x"
}
```

## 🗄️ Database Migrations

Migrations are automatically run before each deployment via the `preDeployCommand`.

To run migrations manually:
```bash
npm run db:migrate
```

## 📝 Important Notes

1. **Database Sync**: In production, `SKIP_DB_SYNC` is set to `true` to prevent automatic schema changes
2. **Migrations**: Always use Sequelize migrations for schema changes in production
3. **SSL**: Database SSL is enabled for production environments
4. **Connection Pooling**: Configured for optimal performance with Railway's infrastructure

## 🔗 API Endpoints

Once deployed, your backend will be available at:
```
https://your-app-name.up.railway.app
```

Main endpoints:
- `GET /` - Welcome message
- `GET /health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/products` - Products listing
- And more...

## 🛠️ Troubleshooting

### Database Connection Issues
- Verify all DATABASE_* environment variables are set correctly
- Ensure DATABASE_SSL=true for cloud databases
- Check that your database allows connections from Railway's IP ranges

### Migration Failures
- Check migration files in `/migrations` directory
- Verify database credentials have sufficient permissions
- Review Railway deployment logs for specific errors

### Application Crashes
- Check Railway logs for error messages
- Verify all required environment variables are set
- Ensure Node.js version matches the requirement (>=18.x)

## 📞 Support

For issues or questions, contact the development team.
