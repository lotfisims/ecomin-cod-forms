# 🔗 Link Your Project to Existing Shopify App

This guide will help you link this local project to your existing Shopify app:
**App ID**: 297703899137

## 📋 Step-by-Step Instructions

### Step 1: Get Your App Credentials

1. **Go to your Shopify Partners Dashboard**:
   - Visit: https://partners.shopify.com/192278600/apps/297703899137
   - Or click: https://partners.shopify.com/ and navigate to your app

2. **Find your API credentials**:
   - On your app page, look for the **"Configuration"** or **"Overview"** section
   - You'll need:
     - **Client ID** (also called API Key)
     - **Client Secret** (also called API Secret)

3. **Copy these values** - you'll need them in the next steps

---

### Step 2: Create Your Environment File

1. **Copy the template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file**:
   
   **On Windows:**
   ```bash
   notepad .env
   ```
   
   **On Mac/Linux:**
   ```bash
   nano .env
   # or
   code .env  # if using VS Code
   ```

3. **Fill in your credentials**:
   ```env
   SHOPIFY_API_KEY=your_client_id_here
   SHOPIFY_API_SECRET=your_client_secret_here
   SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
   SHOPIFY_APP_URL=https://localhost
   DATABASE_URL=file:./dev.sqlite
   ```

4. **Replace**:
   - `your_client_id_here` → Your actual Client ID
   - `your_client_secret_here` → Your actual Client Secret

5. **Save the file**

---

### Step 3: Update shopify.app.toml

1. **Open shopify.app.toml**:
   ```bash
   # Windows
   notepad shopify.app.toml
   
   # Mac/Linux
   nano shopify.app.toml
   # or
   code shopify.app.toml
   ```

2. **Update the client_id field** (line 3):
   ```toml
   client_id = "your_client_id_here"
   ```
   Replace `your_client_id_here` with your actual Client ID (same as SHOPIFY_API_KEY)

3. **Save the file**

---

### Step 4: Update App URLs in Shopify Partner Dashboard

You need to configure your app to accept connections from your local development environment.

1. **Go to your app configuration**:
   - Visit: https://partners.shopify.com/192278600/apps/297703899137
   - Click on **"Configuration"** tab

2. **Update App URL** (will be updated automatically when you run `npm run dev`):
   - For now, you can leave it as is
   - Shopify CLI will update it when you start the dev server

3. **Update Allowed redirection URL(s)**:
   Add these URLs (the CLI might auto-add them, but verify):
   ```
   https://localhost/auth/callback
   https://localhost/auth/shopify/callback
   https://localhost/api/auth/callback
   ```
   
   **Note**: When you run `npm run dev`, Shopify CLI will create a tunnel URL (like `https://xxx.ngrok.io`). You'll need to add those URLs too:
   ```
   https://your-tunnel-url.ngrok.io/auth/callback
   https://your-tunnel-url.ngrok.io/auth/shopify/callback
   https://your-tunnel-url.ngrok.io/api/auth/callback
   ```

4. **Click "Save"**

---

### Step 5: Configure App Scopes

1. **In your app configuration**, find the **"App scopes"** section

2. **Verify these scopes are enabled**:
   - ✅ `write_checkouts`
   - ✅ `read_customers`
   - ✅ `write_customers`
   - ✅ `read_online_store_pages`
   - ✅ `write_online_store_pages`
   - ✅ `read_orders`
   - ✅ `read_product_listings`
   - ✅ `read_products`
   - ✅ `write_script_tags`
   - ✅ `read_themes`
   - ✅ `write_themes`

3. **Save changes**

---

### Step 6: Set Up the Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create/update database
npm run prisma:push
```

You should see:
```
✓ Prisma Client generated
✓ Database synchronized
```

---

### Step 7: Start Development Server

```bash
npm run dev
```

**What happens next:**
1. Shopify CLI will detect your app configuration
2. It will create a secure tunnel (using ngrok or similar)
3. Your browser will open automatically
4. You'll see a URL like: `https://xxx-xxx-xxx.trycloudflare.com`

**Important**: The first time you run this:
- The CLI will ask you to **update your app URLs**
- Type `y` (yes) to allow automatic updates
- The CLI will update your Partner Dashboard with the tunnel URLs

---

### Step 8: Install on Development Store

1. **The browser will open** to an installation page

2. **If you don't have a development store**:
   - Go to: https://partners.shopify.com/192278600/stores
   - Click **"Add store"** → **"Development store"**
   - Create a new development store

3. **Select your development store** from the list

4. **Click "Install app"**

5. **Approve the permissions**

6. **You'll be redirected to your app dashboard!** 🎉

---

## ✅ Verification Checklist

After completing the steps above:

- [ ] `.env` file created with correct credentials
- [ ] `shopify.app.toml` has correct `client_id`
- [ ] Database generated successfully
- [ ] `npm run dev` runs without errors
- [ ] Browser opens automatically
- [ ] App installs on development store
- [ ] Dashboard loads correctly
- [ ] Can navigate between tabs
- [ ] Can generate Ecomin API credentials

---

## 🐛 Troubleshooting

### "Invalid API key or access token"
**Solution**: 
- Double-check your Client ID and Client Secret in `.env`
- Make sure there are no extra spaces
- Restart `npm run dev` after changes

### "Redirect URI mismatch"
**Solution**:
- Run `npm run dev` first to get the tunnel URL
- Add the tunnel URLs to your app's redirect URLs:
  ```
  https://your-tunnel-url/auth/callback
  https://your-tunnel-url/auth/shopify/callback
  https://your-tunnel-url/api/auth/callback
  ```

### "App couldn't be installed"
**Solution**:
- Verify all scopes are enabled in Partner Dashboard
- Check that your app URLs are correct
- Try uninstalling and reinstalling

### Shopify CLI not found
**Solution**:
```bash
npm install -g @shopify/cli @shopify/app
```

### Port 3000 already in use
**Solution**:
```bash
# Kill the process (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🔄 Alternative Method: Using Shopify CLI Link

If you prefer, you can use Shopify CLI to link automatically:

```bash
# This command will guide you through linking
shopify app config link
```

Follow the prompts:
1. Select your organization (192278600)
2. Select your app (297703899137)
3. The CLI will update your configuration files

---

## 📝 Quick Reference

**Your App Details:**
- Organization ID: 192278600
- App ID: 297703899137
- Partner Dashboard: https://partners.shopify.com/192278600/apps/297703899137

**Files to Update:**
1. `.env` - Add Client ID and Client Secret
2. `shopify.app.toml` - Add Client ID

**Commands:**
```bash
# Setup
cp .env.example .env
npm run prisma:generate
npm run prisma:push

# Start development
npm run dev

# Link app (alternative)
shopify app config link
```

---

## 🎯 Next Steps After Linking

Once your app is linked and running:

1. **Test the dashboard** - Navigate through all tabs
2. **Generate API credentials** - Go to Settings & Integration → Ecomin API
3. **Run test script** - `npm run test:credentials`
4. **Start developing** - Add your custom features

---

## 💡 Pro Tips

1. **Keep the terminal open** - You'll see logs and errors here
2. **The tunnel URL changes** - Each time you run `npm run dev`, you might get a new URL
3. **Use development store** - Don't test on production stores
4. **Save your credentials** - Keep a backup of your Client ID and Secret

---

**Need more help?** 
- Check the main [README.md](README.md)
- Review [GET_STARTED.md](GET_STARTED.md)
- Visit [Shopify's documentation](https://shopify.dev/docs/apps/tools/cli)

---

**Let's get your app connected! 🚀**
