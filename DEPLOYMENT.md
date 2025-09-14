# RateSmart Deployment Guide

This guide covers deploying the RateSmart application to Vercel (frontend) and Render (backend).

## Architecture

- **Frontend**: React app deployed to Vercel
- **Backend**: Django REST API deployed to Render
- **Database**: PostgreSQL (provided by Render)

## Frontend Deployment (Vercel)

### 1. Prepare Repository
The frontend is configured with `vercel.json` for proper deployment.

### 2. Environment Variables
Set these environment variables in your Vercel project:
- `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

### 3. Deploy
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the React app
3. Set the root directory to the project root
4. Deploy

## Backend Deployment (Render)

### 1. Prepare Repository
The backend includes:
- `render.yaml` for service configuration
- `build.sh` for build process
- `start.sh` for application startup

### 2. Environment Variables
Set these environment variables in your Render service:
- `DJANGO_SECRET_KEY`: Generate a secure secret key
- `DJANGO_DEBUG`: Set to `False`
- `DJANGO_ALLOWED_HOSTS`: Your domain (auto-configured for Render)
- `DATABASE_URL`: PostgreSQL URL (auto-provided by Render)
- `CORS_ALLOWED_ORIGINS`: Your frontend URL
- `DJANGO_SUPERUSER_EMAIL`: (Optional) Admin email
- `DJANGO_SUPERUSER_PASSWORD`: (Optional) Admin password

### 3. Deploy
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Use the following settings:
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
5. Add a PostgreSQL database
6. Deploy

## Post-Deployment Configuration

### 1. Update Frontend Environment
After backend deployment, update the `REACT_APP_API_URL` in Vercel to point to your Render backend URL.

### 2. Update Backend CORS
After frontend deployment, update the `CORS_ALLOWED_ORIGINS` in Render to include your Vercel frontend URL.

### 3. Test the Application
1. Visit your frontend URL
2. Test user registration and login
3. Verify API connectivity
4. Check all features work properly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is added to `CORS_ALLOWED_ORIGINS`
2. **Database Errors**: Verify `DATABASE_URL` is set correctly
3. **Static Files Not Loading**: Check `STATIC_ROOT` and `STATICFILES_DIRS` configuration
4. **Build Failures**: Check logs for missing dependencies or configuration errors

### Logs
- **Vercel**: Check deployment logs in Vercel dashboard
- **Render**: Check service logs in Render dashboard

## Environment Files

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_ENV=production
```

### Backend (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend.onrender.com
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## Security Considerations

1. Always use HTTPS in production
2. Set strong secret keys
3. Configure proper CORS settings
4. Use environment variables for sensitive data
5. Enable Django security features for production