# RateSmart - Business Review Platform

RateSmart is a comprehensive business review platform that allows customers to discover businesses, leave reviews, and enables businesses to manage their online presence. The platform includes AI-powered sentiment analysis and fake review detection.

## 🚀 Live Deployments

- **Frontend (Vercel):** https://ratesmart-eosin.vercel.app/
- **Backend (Render):** https://ratesmart.onrender.com

## 🏗️ Architecture

- **Frontend:** React.js with Bootstrap for UI
- **Backend:** Django REST Framework
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Authentication:** JWT tokens
- **AI Features:** TextBlob for sentiment analysis and fake review detection

## 🌟 Features

### For Customers
- Search and discover businesses
- Leave detailed reviews with ratings
- View business profiles and reviews
- AI-powered review authenticity verification

### For Businesses
- Complete dashboard for managing business information
- Product/service management
- Review monitoring and response system
- Analytics and sentiment insights
- Profile customization

### For Administrators
- System overview and analytics
- Business and review management
- System reset capabilities
- Comprehensive admin dashboard

## 🛠️ Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🚀 Deployment Instructions

### Backend Deployment (Render)

1. **Push your code to GitHub**

2. **Create a new Web Service on Render:**
   - Connect your GitHub repository
   - Set build command: `./build.sh`
   - Set start command: `gunicorn backend.wsgi:application`
   - Set environment variables:
     - `SECRET_KEY`: Generate a secure key
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `your-app-name.onrender.com`
     - `DATABASE_URL`: Will be provided by Render PostgreSQL

3. **Add PostgreSQL database:**
   - Create a PostgreSQL database on Render
   - Connect it to your web service

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel:**
   - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com/api`

## 📁 Project Structure

```
ratesmart/
├── backend/                 # Django backend
│   ├── backend/            # Main Django project
│   ├── core/              # Main application
│   ├── requirements.txt   # Python dependencies
│   ├── build.sh          # Build script for deployment
│   └── render.yaml       # Render deployment config
├── src/                   # React frontend
│   ├── pages/            # React page components
│   ├── config/           # Configuration files
│   └── ...
├── public/               # Static assets
├── package.json         # Node.js dependencies
├── vercel.json         # Vercel deployment config
└── README.md           # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/signup/` - Business registration
- `POST /api/login/` - Business login

### Businesses
- `GET /api/businesses/` - List all businesses
- `GET /api/businesses/search/` - Search businesses
- `GET /api/businesses/{id}/` - Get business details
- `PUT /api/businesses/{id}/` - Update business (authenticated)

### Products
- `GET /api/products/` - List all products
- `GET /api/products/business/{id}/` - Get business products
- `POST /api/products/` - Create product (authenticated)

### Reviews
- `GET /api/reviews/` - List all reviews
- `GET /api/reviews/business/{id}/` - Get business reviews
- `POST /api/reviews/` - Create review
- `PUT /api/reviews/{id}/` - Update review (authenticated)

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
npm test
```

## 🔒 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
DATABASE_URL=postgresql://user:password@host:port/database
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ratesmart.com or create an issue in this repository.

## 🎯 Future Enhancements

- Mobile application
- Advanced analytics dashboard
- Integration with social media platforms
- Multi-language support
- Enhanced AI features for review analysis
- Email notification system
- Advanced search filters
- Business verification system

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
