# Quick Start Guide - Ecomin Connector and Forms

Get your Shopify app up and running in 10 minutes!

## ⚡ Prerequisites

Before you start, make sure you have:

- ✅ Node.js (v18 or higher) installed
- ✅ npm or yarn package manager
- ✅ Shopify Partner account
- ✅ Shopify CLI installed (`npm install -g @shopify/cli @shopify/app`)

## 🚀 5-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Shopify App

1. Go to [Shopify Partners Dashboard](https://partners.shopify.com/)
2. Click **Apps** → **Create App**
3. Choose **Create app manually**
4. Fill in:
   - **App name**: Ecomin Connector and Forms
   - **App URL**: https://localhost (temporary)
   - **Allowed redirection URLs**:
     ```
     https://localhost/auth/callback
     https://localhost/auth/shopify/callback
     https://localhost/api/auth/callback
     ```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your Shopify app credentials:

```env
SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
SHOPIFY_APP_URL=https://localhost
DATABASE_URL=file:./dev.sqlite
```

### Step 4: Set Up Database

```bash
npm run prisma:generate
npm run prisma:push
```

### Step 5: Start Development Server

```bash
npm run dev
```

The Shopify CLI will:
- Start your app on a local server
- Create a tunnel for external access
- Open a browser to install the app

## 🎉 You're Ready!

Your app is now running. You can:

1. **Access the dashboard** - Navigate through the three main tabs
2. **Generate API credentials** - Go to Settings & Integration → Ecomin API
3. **Test credential generation** - Run `npm run test:credentials`

## 📱 Testing on a Development Store

1. Create a development store in your Partner Dashboard
2. Install your app on the development store
3. Test all features:
   - Dashboard navigation
   - API credential generation
   - Credential retrieval

## 🔧 Common Issues

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

### Port already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
# or change the port in vite.config.js
```

### Prisma errors
```bash
# Reset database
rm -f prisma/*.db
npm run prisma:push
```

## 📚 Next Steps

- Read the [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## 🆘 Need Help?

- Check the [troubleshooting section](README.md#-troubleshooting)
- Open an issue on GitHub
- Review Shopify's [app development docs](https://shopify.dev/docs/apps)

---

**Happy coding! 🚀**
