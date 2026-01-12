# Deployment Guide - Ecomin Connector and Forms

This guide provides detailed instructions for deploying your Shopify app to various hosting providers.

## 📋 Pre-Deployment Checklist

- [ ] All tests pass successfully
- [ ] Environment variables configured
- [ ] Database schema is up to date
- [ ] Shopify app is created in Partner Dashboard
- [ ] App URL is configured correctly
- [ ] Webhooks are set up

## 🚀 Deployment Options

### Option 1: Shopify Hosting

The easiest way to deploy is using Shopify's built-in hosting:

```bash
npm run deploy
```

This command will:
1. Build your application
2. Deploy to Shopify's infrastructure
3. Configure webhooks automatically
4. Set up SSL certificates

### Option 2: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create a new Heroku app**
```bash
heroku create your-app-name
```

3. **Add PostgreSQL addon** (recommended for production)
```bash
heroku addons:create heroku-postgresql:mini
```

4. **Set environment variables**
```bash
heroku config:set SHOPIFY_API_KEY=your_api_key
heroku config:set SHOPIFY_API_SECRET=your_api_secret
heroku config:set SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
heroku config:set SHOPIFY_APP_URL=https://your-app-name.herokuapp.com
heroku config:set NODE_ENV=production
```

5. **Deploy**
```bash
git push heroku main
```

6. **Run database migrations**
```bash
heroku run npm run prisma:push
```

### Option 3: Vercel

#### Prerequisites
- Vercel account
- Vercel CLI installed

#### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set environment variables** (via Vercel Dashboard)
- Go to your project settings
- Add all required environment variables
- Redeploy

5. **Configure for production**
```bash
vercel --prod
```

**Note**: For Vercel, you may need to configure a PostgreSQL database separately (e.g., using Railway or Supabase).

### Option 4: Railway

#### Prerequisites
- Railway account

#### Steps

1. **Connect your repository to Railway**
   - Visit [Railway](https://railway.app/)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Add PostgreSQL database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

3. **Set environment variables**
   - Go to your service settings
   - Add all required variables
   - Railway will automatically redeploy

4. **Configure custom domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain

### Option 5: Render

#### Prerequisites
- Render account

#### Steps

1. **Create a new Web Service**
   - Visit [Render](https://render.com/)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure build settings**
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`

3. **Add PostgreSQL database**
   - Click "New +" → "PostgreSQL"
   - Copy the Internal Database URL

4. **Set environment variables**
   ```
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
   SHOPIFY_APP_URL=https://your-app.onrender.com
   DATABASE_URL=your_postgres_url
   NODE_ENV=production
   ```

5. **Deploy**
   - Render will automatically build and deploy

### Option 6: Docker Deployment

#### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SHOPIFY_API_KEY=${SHOPIFY_API_KEY}
      - SHOPIFY_API_SECRET=${SHOPIFY_API_SECRET}
      - SCOPES=${SCOPES}
      - SHOPIFY_APP_URL=${SHOPIFY_APP_URL}
      - DATABASE_URL=postgresql://user:password@db:5432/ecomin
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./prisma:/app/prisma

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=ecomin
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npm run prisma:push
```

## 🔧 Post-Deployment Configuration

### 1. Update Shopify App Settings

In your Shopify Partner Dashboard:

1. Go to your app settings
2. Update **App URL** to your deployment URL
3. Update **Allowed redirection URL(s)**:
   ```
   https://your-app-url.com/auth/callback
   https://your-app-url.com/auth/shopify/callback
   https://your-app-url.com/api/auth/callback
   ```

### 2. Configure Webhooks

Webhooks should be automatically registered, but verify:

1. Check webhook subscriptions in Partner Dashboard
2. Ensure the following webhooks are active:
   - `app/uninstalled` → `/api/webhooks`
   - `app/scopes_update` → `/api/webhooks`

### 3. Test Your Deployment

1. Install the app on a development store
2. Test all features:
   - Authentication flow
   - Dashboard loading
   - API credential generation
   - Credential retrieval
3. Check logs for any errors

### 4. Monitor Your App

Set up monitoring and logging:

- **Application logs**: Check your hosting provider's log viewer
- **Error tracking**: Consider integrating Sentry or similar
- **Performance monitoring**: Use New Relic or Datadog
- **Uptime monitoring**: Use UptimeRobot or Pingdom

## 🔒 Production Security Checklist

- [ ] All environment variables are secure
- [ ] Database has proper access controls
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (if needed)
- [ ] API secrets are rotated regularly
- [ ] Logs don't expose sensitive data
- [ ] Database backups are configured

## 📊 Database Considerations

### SQLite (Development Only)

SQLite is suitable for development but NOT recommended for production:
- Limited concurrent connections
- No built-in replication
- File-based storage

### PostgreSQL (Recommended for Production)

Update your `schema.prisma` for PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npm run prisma:generate
npm run prisma:push
```

### Database Migration Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Create a migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## 🚨 Troubleshooting

### Build Failures

**Issue**: `MODULE_NOT_FOUND` errors
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Prisma client not generated
```bash
# Solution: Generate client
npm run prisma:generate
```

### Runtime Errors

**Issue**: Database connection fails
- Verify `DATABASE_URL` is set correctly
- Check database service is running
- Ensure network access is allowed

**Issue**: Authentication fails
- Verify `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET`
- Check `SHOPIFY_APP_URL` matches deployment URL
- Ensure redirect URLs are configured in Partner Dashboard

### Performance Issues

**Issue**: Slow response times
- Enable caching for static assets
- Optimize database queries
- Consider using a CDN
- Scale your hosting resources

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npm run prisma:generate
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Hosting Provider
        run: |
          # Add your deployment command here
          # Example for Heroku:
          # git push heroku main
```

## 📈 Scaling Considerations

As your app grows:

1. **Database**: 
   - Use connection pooling
   - Implement read replicas
   - Consider database clustering

2. **Application**:
   - Use load balancers
   - Implement caching (Redis)
   - Optimize bundle size

3. **Monitoring**:
   - Set up alerts for errors
   - Monitor response times
   - Track resource usage

## 🆘 Support

If you encounter issues during deployment:

1. Check the logs on your hosting provider
2. Review the troubleshooting section
3. Consult Shopify's deployment documentation
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**
