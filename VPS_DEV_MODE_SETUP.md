# 🔧 Running Shopify App in Development Mode on VPS

## The Problem

When you run `shopify app dev` on your VPS and try to access the app from Shopify, you're seeing the website at https://ecomin.app instead of your Shopify app.

**This happens because:**
1. `shopify app dev` creates a tunnel URL for the app
2. Your Shopify Partner Dashboard is configured to use https://ecomin.app
3. The app URL needs to point to the tunnel URL, not the website

---

## 🎯 Solution: Use a Subdomain or Different Port

You have several options:

### **Option 1: Use a Subdomain (RECOMMENDED)**

Use a subdomain like `app.ecomin.app` or `shopify.ecomin.app` for your Shopify app.

#### Steps:

**1. Create DNS Record**
- Go to your domain provider (where ecomin.app is registered)
- Add an A record:
  - **Type**: A
  - **Name**: `app` (or `shopify`)
  - **Value**: Your VPS IP address
  - **TTL**: 3600

**2. Update your project files:**

On your VPS, in the project folder:
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms

# Edit .env
nano .env
```

Change the app URL:
```env
SHOPIFY_APP_URL=https://app.ecomin.app
```

**3. Update shopify.app.toml:**
```bash
nano shopify.app.toml
```

Change:
```toml
application_url = "https://app.ecomin.app"

[auth]
redirect_urls = [
  "https://app.ecomin.app/auth/callback",
  "https://app.ecomin.app/auth/shopify/callback",
  "https://app.ecomin.app/api/auth/callback"
]
```

**4. Create Nginx config for subdomain:**
```bash
sudo nano /etc/nginx/sites-available/app-ecomin
```

Paste:
```nginx
server {
    listen 80;
    server_name app.ecomin.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/app-ecomin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. Get SSL for subdomain:**
```bash
sudo certbot --nginx -d app.ecomin.app
```

**6. Run shopify app dev:**
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms
shopify app dev
```

---

### **Option 2: Use Cloudflare Tunnel (No subdomain needed)**

This creates a secure tunnel without needing DNS changes.

**1. Install Cloudflare Tunnel:**
```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate
cloudflared tunnel login
```

**2. Create tunnel:**
```bash
cloudflared tunnel create ecomin-shopify-app
```

**3. Configure tunnel:**
```bash
nano ~/.cloudflared/config.yml
```

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: YOUR_TUNNEL_URL.trycloudflare.com
    service: http://localhost:3000
  - service: http_status:404
```

**4. Run tunnel:**
```bash
cloudflared tunnel run ecomin-shopify-app
```

**5. Update Shopify app URLs to use the tunnel URL**

---

### **Option 3: Use Different Port with Path (Quick Fix)**

Keep https://ecomin.app but use a different path like `/shopify-app`

**1. Update Nginx for main site:**
```bash
sudo nano /etc/nginx/sites-available/ecomin.app
```

Add location block:
```nginx
server {
    server_name ecomin.app www.ecomin.app;

    # Your existing website
    location / {
        # Your existing config for the website
    }

    # Shopify app on a specific path
    location /shopify-app {
        rewrite ^/shopify-app/(.*) /$1 break;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**This is NOT recommended** because Shopify apps expect to be at the root path.

---

## 🚀 Recommended Approach: Use Subdomain

Here's what I recommend:

### **Quick Setup (5 minutes):**

```bash
# 1. Go to your project
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms

# 2. Update .env
nano .env
# Change SHOPIFY_APP_URL to: https://app.ecomin.app

# 3. Update shopify.app.toml
nano shopify.app.toml
# Change application_url to: https://app.ecomin.app
# Update redirect_urls to use app.ecomin.app

# 4. Create Nginx config
sudo nano /etc/nginx/sites-available/app-ecomin
# Paste the config from above

# 5. Enable and restart
sudo ln -s /etc/nginx/sites-available/app-ecomin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 6. Get SSL
sudo certbot --nginx -d app.ecomin.app

# 7. Install dependencies if not done
npm install

# 8. Run dev mode
shopify app dev
```

---

## 🔍 Alternative: Use Shopify's Tunnel Automatically

The easiest way is to let Shopify CLI handle everything:

```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms

# Install dependencies
npm install

# Run shopify app dev
shopify app dev
```

**When it starts:**
1. Shopify CLI will create a tunnel URL (like `https://xxx.ngrok.io` or similar)
2. It will ask if you want to update your app configuration
3. Say YES
4. It will automatically update your Partner Dashboard with the tunnel URL
5. The app will work correctly

**The tunnel URL changes each time you restart**, so this is only good for development.

---

## 📱 Update Shopify Partner Dashboard

After choosing your option, update:

**Go to:** https://partners.shopify.com/192278600/apps/297703899137

**Update:**
1. **App URL**: 
   - Option 1: `https://app.ecomin.app`
   - Option 2: Your Cloudflare tunnel URL
   - Shopify CLI option: Let CLI update automatically

2. **Allowed redirection URLs**:
   ```
   https://app.ecomin.app/auth/callback
   https://app.ecomin.app/auth/shopify/callback
   https://app.ecomin.app/api/auth/callback
   ```

---

## 🎯 What I Recommend

**For development on VPS:**
1. Create subdomain `app.ecomin.app`
2. Point it to your VPS IP
3. Configure Nginx for the subdomain
4. Get SSL for the subdomain
5. Update .env and shopify.app.toml
6. Run `shopify app dev`

**This gives you:**
- ✅ Your website stays at https://ecomin.app
- ✅ Your app runs at https://app.ecomin.app
- ✅ Clean separation
- ✅ Proper SSL
- ✅ Easy to manage

---

## 🆘 Current Issue Fix

**Right now, to fix your immediate issue:**

```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms

# Kill any running processes
pm2 delete all  # if using PM2
# or
pkill -f "node"

# Run shopify app dev
shopify app dev

# When it asks about updating app URLs, say YES
```

Then access your app from the Shopify admin. It should work with the tunnel URL.

---

Let me know which option you prefer and I'll help you set it up! 🚀
