# RateSmart

A comprehensive business rating and review platform built with React frontend and Django backend.

## Architecture

- **Frontend**: React application (Create React App)
- **Backend**: Django REST API with JWT authentication
- **Database**: PostgreSQL (SQLite for development)

## Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yaqub-J/ratesmart.git
   cd ratesmart
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm start
   ```

3. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

## Deployment

### Production Deployment (Vercel + Render)

This project is optimized for deployment on:
- **Frontend**: Vercel
- **Backend**: Render.com

#### Quick Deployment Check
```bash
./verify-deployment.sh
```

#### Detailed Instructions
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

### Environment Variables

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_ENV=production
```

#### Backend (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-backend.onrender.com
DATABASE_URL=postgresql://...
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## Features

- Business registration and management
- User reviews and ratings
- Admin dashboard
- JWT authentication
- Search functionality
- Responsive design

## Available Scripts

### Frontend
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

### Backend
- `python manage.py runserver` - Development server
- `python manage.py migrate` - Run migrations
- `python manage.py collectstatic` - Collect static files
- `./build.sh` - Production build script

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
