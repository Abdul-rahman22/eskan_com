# Render.com Deployment Guide for Eskan Project

## Overview

This guide provides step-by-step instructions to deploy the Eskan full-stack application (Django backend + React frontend) to Render.com completely free.

**Key Features:**
- ✅ Completely free (no credit card required)
- ✅ Full-stack deployment (frontend + backend)
- ✅ PostgreSQL database included
- ✅ SSL/HTTPS automatic
- ✅ Custom domain support
- ✅ Environment-based configuration

## Prerequisites

1. **GitHub Account** - Already available (Abdul-rahman22)
2. **Render.com Account** - Free account at https://render.com
3. **Custom Domain** (Optional) - eskan.com registered and pointing to Render
4. **Email** - ba2907403@gmail.com for notifications

## Step 1: Sign Up / Login to Render.com

1. Go to https://render.com
2. Click "Sign up" or "Sign in"
3. Choose "Sign up with GitHub" (recommended)
4. Authorize Render to access your GitHub account
5. You'll be redirected to the Render dashboard

## Step 2: Create Backend Service

### 2.1 Connect GitHub Repository

1. In Render dashboard, click "+ New"
2. Select "Web Service"
3. Click "Connect a repository"
4. Find and select `Abdul-rahman22/eskan_com`
5. Click "Connect"

### 2.2 Configure Backend Service

**Basic Settings:**
- **Name:** `eskan-backend`
- **Environment:** `Python 3`
- **Build Command:** 
  ```
  pip install -r backend/requirements.txt && python backend/manage.py migrate && python backend/manage.py collectstatic --noinput
  ```
- **Start Command:** 
  ```
  cd backend && gunicorn backend_project.wsgi:application --bind 0.0.0.0:$PORT
  ```
- **Plan:** Free
- **Region:** Choose closest to your users (e.g., Frankfurt, Singapore, or US East)

### 2.3 Add Environment Variables

Click "Advanced" and add these environment variables:

```
DEBUG=false
ALLOWED_HOSTS=*.onrender.com,eskan.com,www.eskan.com
DATABASE_URL=(will be set automatically)
CSRF_TRUSTED_ORIGINS=https://*.onrender.com,https://eskan.com,https://www.eskan.com
CORS_ALLOWED_ORIGINS=https://*.onrender.com,https://eskan.com,https://www.eskan.com
SECRET_KEY=(auto-generated)
```

For database connection, Render will automatically create a PostgreSQL database and set `DATABASE_URL`.

### 2.4 Deploy

1. Click "Create Web Service"
2. Render will start building and deploying
3. Wait for deployment to complete (5-10 minutes)
4. Note the service URL (e.g., `https://eskan-backend.onrender.com`)

## Step 3: Create Frontend Service

### 3.1 Add Frontend Service

1. In Render dashboard, click "+ New"
2. Select "Static Site"
3. Connect the same repository `eskan_com`
4. Enter settings:
   - **Name:** `eskan-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish directory:** `dist`
   - **Plan:** Free

### 3.2 Frontend Environment Variables

Add this environment variable:
```
VITE_API_URL=https://eskan-backend.onrender.com
```

This tells the frontend where to find the backend API.

### 3.3 Deploy

1. Click "Create Static Site"
2. Wait for build to complete (2-5 minutes)
3. Note the frontend URL (e.g., `https://eskan-frontend.onrender.com`)

## Step 4: Connect PostgreSQL Database

### 4.1 Create PostgreSQL Database

1. In Render dashboard, click "+ New"
2. Select "PostgreSQL"
3. Configure:
   - **Name:** `eskan-db`
   - **Database:** `eskan_production`
   - **User:** `eskan_user`
   - **Plan:** Free
   - **Region:** Same as backend service
4. Click "Create Database"

### 4.2 Connect to Backend

1. Copy the database connection string from database details
2. Go to backend service settings
3. Update environment variable: `DATABASE_URL` with the connection string
4. Redeploy backend service

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain to Frontend

1. Go to frontend service settings
2. Click "Custom Domain"
3. Enter: `eskan.com`
4. Add DNS records as instructed by Render
5. Verify domain (may take 24-48 hours)

### 5.2 Add Custom Domain to Backend

1. Go to backend service settings
2. Click "Custom Domain"
3. Enter: `api.eskan.com`
4. Add DNS records
5. Update frontend environment variable: `VITE_API_URL=https://api.eskan.com`

## Step 6: Verify Deployment

### 6.1 Test Backend API

```bash
curl https://eskan-backend.onrender.com/api/health/
```

Should return status 200.

### 6.2 Test Frontend

1. Visit `https://eskan-frontend.onrender.com`
2. Should load without errors
3. Frontend should successfully connect to backend

### 6.3 Check Logs

1. Each service has logs accessible from dashboard
2. Check backend logs for any Django errors
3. Check frontend logs for build errors

## Troubleshooting

### Backend Build Fails

**Problem:** `ModuleNotFoundError: No module named...`

**Solution:**
1. Ensure `backend/requirements.txt` exists with all dependencies
2. Check Python version compatibility
3. View build logs for specific errors

### Frontend API Calls Fail

**Problem:** CORS errors or 404s

**Solution:**
1. Verify backend `CORS_ALLOWED_ORIGINS` includes frontend URL
2. Check `VITE_API_URL` environment variable is correct
3. Rebuild frontend after changing env vars

### Database Connection Issues

**Problem:** `psycopg2.OperationalError`

**Solution:**
1. Verify `DATABASE_URL` is set correctly
2. Check database exists and credentials are correct
3. Run migrations manually if needed

### Custom Domain Not Working

**Problem:** Domain shows Render parking page

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records are correctly added
3. Check domain registrar (eskan.com) DNS settings
4. Clear browser cache and try again

## Maintenance

### Regular Updates

1. **Push to GitHub** - New commits trigger automatic redeploy
2. **Database backups** - Configured automatically on Render free tier
3. **Monitor logs** - Check for errors regularly

### Scaling (When Needed)

When outgrowing free tier:
1. Upgrade service plans to paid
2. Database: Consider managed PostgreSQL
3. Frontend: Consider CDN for static files

## Important Notes

⚠️ **Free Tier Limits:**
- Services auto-sleep after 15 minutes of inactivity
- First request after sleep takes 30 seconds
- Limited to 1 concurrent build
- Database limited to 5GB storage

✅ **Best Practices:**
1. Use environment variables for all configuration
2. Keep requirements.txt updated
3. Monitor performance in dashboard
4. Set up error notifications
5. Regular database backups

## Quick Reference URLs

After deployment:
- **Frontend:** https://eskan-frontend.onrender.com
- **Backend API:** https://eskan-backend.onrender.com
- **Custom Domain:** https://eskan.com
- **API Base URL:** https://api.eskan.com (after setup)
- **Render Dashboard:** https://dashboard.render.com

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Django Deployment Guide](https://render.com/docs/deploy-django)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Custom Domains](https://render.com/docs/custom-domains)

## Support

For issues or questions:
1. Check Render documentation
2. View service logs in dashboard
3. Contact Render support: support@render.com
4. Check Django documentation for backend issues

---

**Last Updated:** November 19, 2024
**Status:** Ready for Render Deployment
**Project:** Eskan Full-Stack Application
