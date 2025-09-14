#!/bin/bash

# RateSmart Deployment Verification Script
# This script helps verify that the deployment configuration is correct

echo "🔍 RateSmart Deployment Verification"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📱 Frontend Checks:"
echo "------------------"

# Check frontend build
echo "🔨 Testing frontend build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    echo "   Run 'npm run build' to see detailed errors"
fi

# Check for required files
if [ -f "vercel.json" ]; then
    echo "✅ Vercel configuration found"
else
    echo "❌ Vercel configuration missing"
fi

echo ""
echo "🐍 Backend Checks:"
echo "-----------------"

cd backend

# Check Django configuration
echo "🔨 Testing Django configuration..."
if python manage.py check > /dev/null 2>&1; then
    echo "✅ Django configuration is valid"
else
    echo "❌ Django configuration has issues"
    echo "   Run 'cd backend && python manage.py check' to see details"
fi

# Check for required files
if [ -f "build.sh" ] && [ -x "build.sh" ]; then
    echo "✅ Build script found and executable"
else
    echo "❌ Build script missing or not executable"
fi

if [ -f "requirements.txt" ]; then
    echo "✅ Requirements file found"
else
    echo "❌ Requirements file missing"
fi

if [ -f "render.yaml" ]; then
    echo "✅ Render configuration found"
else
    echo "❌ Render configuration missing"
fi

cd ..

echo ""
echo "📋 Environment Variables:"
echo "-------------------------"

echo "Frontend (.env.production):"
if [ -f ".env.production" ]; then
    echo "✅ Production environment file exists"
    if grep -q "REACT_APP_API_URL" .env.production; then
        echo "✅ API URL configured"
    else
        echo "⚠️  API URL not configured in .env.production"
    fi
else
    echo "⚠️  .env.production file not found"
    echo "   Copy .env.production.example and configure it"
fi

echo ""
echo "Backend (.env):"
if [ -f "backend/.env" ]; then
    echo "✅ Backend environment file exists"
    cd backend
    if grep -q "DJANGO_SECRET_KEY" .env; then
        echo "✅ Secret key configured"
    else
        echo "⚠️  Secret key not configured"
    fi
    
    if grep -q "DATABASE_URL" .env; then
        echo "✅ Database URL configured"
    else
        echo "⚠️  Database URL not configured"
    fi
    cd ..
else
    echo "⚠️  backend/.env file not found"
    echo "   Copy backend/.env.example and configure it"
fi

echo ""
echo "🚀 Deployment Readiness:"
echo "========================"

# Overall assessment
ISSUES=0

if [ ! -f "vercel.json" ]; then
    ((ISSUES++))
fi

if [ ! -f "backend/build.sh" ] || [ ! -x "backend/build.sh" ]; then
    ((ISSUES++))
fi

if [ ! -f ".env.production" ]; then
    ((ISSUES++))
fi

if [ ! -f "backend/.env" ]; then
    ((ISSUES++))
fi

if [ $ISSUES -eq 0 ]; then
    echo "🎉 Your project appears ready for deployment!"
    echo ""
    echo "Next Steps:"
    echo "1. Deploy backend to Render.com"
    echo "2. Update REACT_APP_API_URL in Vercel with your Render backend URL"
    echo "3. Deploy frontend to Vercel"
    echo "4. Update CORS_ALLOWED_ORIGINS in Render with your Vercel frontend URL"
else
    echo "⚠️  Found $ISSUES potential issues. Please review the checks above."
fi

echo ""
echo "📖 For detailed deployment instructions, see DEPLOYMENT.md"