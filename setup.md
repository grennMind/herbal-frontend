# 🚀 Herbal Marketplace Setup Guide

This guide will walk you through setting up the complete herbal marketplace platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## 🔑 Required API Keys

You'll need to sign up for these services and get API keys:

### 1. Stripe (Payments)
- Visit [stripe.com](https://stripe.com) and create an account
- Get your test API keys from the dashboard
- Set up webhook endpoints for order processing

### 2. Plant.id (Plant Identification)
- Visit [plant.id](https://plant.id) and sign up
- Get your API key from the dashboard
- Test with their free tier (500 identifications/month)

### 3. Infermedica (Symptom Analysis)
- Visit [infermedica.com](https://infermedica.com) and sign up
- Get your App ID and App Key
- Note: This is a medical API with specific use cases

### 4. OpenAI (AI Recommendations)
- Visit [openai.com](https://openai.com) and create an account
- Get your API key from the dashboard
- Start with GPT-3.5-turbo for cost-effectiveness

### 5. Cloudinary (Media Storage)
- Visit [cloudinary.com](https://cloudinary.com) and sign up
- Get your cloud name, API key, and secret
- Set up upload presets for optimization

## 🏗️ Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd herbal-marketplace
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Database Setup

#### 3.1 Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE herbal_marketplace;

# Create user (optional)
CREATE USER herbal_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE herbal_marketplace TO herbal_user;

# Exit PostgreSQL
\q
```

#### 3.2 Run Database Migrations

```bash
cd backend

# Create .env file first (see next step)
# Then run migrations
npm run migrate

# Seed with sample data
npm run seed
```

### Step 4: Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=herbal_marketplace
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# AI API Keys
PLANT_ID_API_KEY=your_plant_id_api_key_here
INFERMEDICA_APP_ID=your_infermedica_app_id_here
INFERMEDICA_APP_KEY=your_infermedica_app_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:5173

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

### Step 5: Test API Keys

#### 5.1 Test Plant.id API

```bash
curl -X POST "https://api.plant.id/v2/identify" \
  -H "Content-Type: application/json" \
  -H "Api-Key: YOUR_PLANT_ID_API_KEY" \
  -d '{
    "images": ["base64_encoded_image"],
    "modifiers": ["crops_fast", "similar_images"],
    "plant_details": ["common_names", "url", "wiki_description"]
  }'
```

#### 5.2 Test OpenAI API

```bash
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'
```

#### 5.3 Test Stripe API

```bash
curl -X GET "https://api.stripe.com/v1/account" \
  -H "Authorization: Bearer YOUR_STRIPE_SECRET_KEY"
```

### Step 6: Start Development Servers

#### 6.1 Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📱 API Health: http://localhost:5000/api/health
✅ Database connection established successfully.
✅ Database models synchronized.
```

#### 6.2 Start Frontend Server

In a new terminal:

```bash
# From project root
npm run dev
```

You should see:
```
  VITE v6.3.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 7: Verify Installation

#### 7.1 Test Backend API

Visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Herbal Marketplace API is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "development"
}
```

#### 7.2 Test Frontend

Visit: `http://localhost:5173`

You should see the herbal marketplace homepage with:
- Navigation menu
- Hero section
- Product listings
- AI tools access

#### 7.3 Test AI Features

1. **Plant Scanner**: Upload an image to test plant identification
2. **Symptom Checker**: Add symptoms to test health analysis
3. **Recommendation Engine**: Input conditions to test AI recommendations

### Step 8: Database Verification

#### 8.1 Check Database Tables

```bash
psql -U your_user -d herbal_marketplace

# List tables
\dt

# Check user table
SELECT * FROM "Users" LIMIT 5;

# Check products table
SELECT * FROM "Products" LIMIT 5;
```

#### 8.2 Verify Sample Data

Ensure you have:
- Sample users (buyer, seller, herbalist)
- Sample products
- Sample orders (if seeded)

## 🔧 Configuration Options

### Customizing Business Logic

Edit `backend/config/config.js` to modify:

- Tax rates
- Shipping costs
- Order limits
- Validation rules
- Feature flags

### Customizing AI Behavior

Modify AI prompts in:
- `backend/routes/ai.js` - Main AI logic
- `src/components/RecommendationEngine/RecommendationEngine.jsx` - Frontend AI interface

### Customizing UI/UX

Edit design system in:
- `src/styles/design-system.css` - Core design tokens
- `tailwind.config.js` - Tailwind configuration
- Component-specific CSS files

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection details
psql -h localhost -U your_user -d herbal_marketplace
```

#### 2. API Keys Not Working

- Verify API keys are correct
- Check API service status pages
- Test with simple curl commands
- Check rate limits and quotas

#### 3. Frontend Can't Connect to Backend

- Verify backend is running on port 5000
- Check CORS configuration
- Verify FRONTEND_URL in .env
- Check browser console for errors

#### 4. File Uploads Not Working

- Verify Cloudinary credentials
- Check file size limits
- Verify upload directory permissions
- Check network connectivity

### Debug Mode

Enable debug logging:

```bash
# Backend
NODE_ENV=development DEBUG=* npm run dev

# Frontend
npm run dev -- --debug
```

## 📱 Testing on Mobile

### Local Network Access

```bash
# Start frontend with host flag
npm run dev -- --host

# Access from mobile device
http://YOUR_LOCAL_IP:5173
```

### Mobile Testing Tools

- Chrome DevTools Device Simulation
- BrowserStack for cross-device testing
- React Native Web for mobile app conversion

## 🚀 Production Deployment

### Environment Variables

Set production values:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
DB_HOST=your_production_db_host
# ... other production values
```

### Security Checklist

- [ ] Change default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up logging

### Performance Optimization

- [ ] Enable database indexing
- [ ] Set up CDN for images
- [ ] Configure caching
- [ ] Optimize bundle size
- [ ] Set up load balancing

## 📚 Next Steps

After successful setup:

1. **Customize Content**: Update product categories, descriptions, and branding
2. **Add Products**: Create your first herbal products
3. **Test Payments**: Make test purchases with Stripe test cards
4. **Train AI**: Improve recommendations with your product data
5. **User Testing**: Get feedback from potential users
6. **Deploy**: Move to production environment

## 🆘 Getting Help

- **Documentation**: Check the main README.md
- **Issues**: Report bugs via GitHub issues
- **Community**: Join our Discord/forum
- **Support**: Email support@herbalmarketplace.com

---

**🎉 Congratulations! You now have a fully functional herbal marketplace running locally.**

*The platform is ready for development, testing, and customization. Happy coding!* 