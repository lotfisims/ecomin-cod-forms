# 🌐 Setting Up app.ecomin.app for Your Shopify App

## Step-by-Step Guide

---

## 1️⃣ Create DNS Record

Go to your domain registrar (where ecomin.app is registered) and add:

**DNS Record:**
- **Type**: A
- **Name**: `app`
- **Value**: Your VPS IP address (the IP of adoring-dirac)
- **TTL**: 3600 (or default)

**To find your VPS IP:**
```bash
curl ifconfig.me
```

**Wait 5-10 minutes** for DNS to propagate.

**Test DNS:**
```bash
ping app.ecomin.app
```

---

## 2️⃣ Update Project Configuration Files

Run these commands on your VPS:

```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms
```

### Update .env file:
```bash
nano .env
```

Change this line:
```env
SHOPIFY_APP_URL=https://app.ecomin.app
```

Save: `Ctrl+X`, `Y`, `Enter`

### Update shopify.app.toml:
```bash
nano shopify.app.toml
```

Change these lines:
```toml
application_url = "https://app.ecomin.app"

[auth]
redirect_urls = [
  "https://app.ecomin.app/auth/callback",
  "https://app.ecomin.app/auth/shopify/callback",
  "https://app.ecomin.app/api/auth/callback"
]
```

Save: `Ctrl+X`, `Y`, `Enter`

---

## 3️⃣ Create Nginx Configuration for Subdomain

```bash
sudo nano /etc/nginx/sites-available/app-ecomin
```

**Paste this:**
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

Save: `Ctrl+X`, `Y`, `Enter`

### Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/app-ecomin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4️⃣ Get SSL Certificate for Subdomain

```bash
sudo certbot --nginx -d app.ecomin.app
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose option 2 (Redirect HTTP to HTTPS)

---

## 5️⃣ Install Dependencies (if not done)

```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms
npm install
```

---

## 6️⃣ Set Up Database

```bash
npm run prisma:generate
npm run prisma:push
```

---

## 7️⃣ Start the App

### Option A: Development Mode (with hot reload)
```bash
shopify app dev
```

**Note:** This starts on port 3000 and Nginx will proxy it to app.ecomin.app

### Option B: Production Mode (with PM2)
```bash
npm run build
pm2 start npm --name "ecomin-app" -- start
pm2 save
```

---

## 8️⃣ Update Shopify Partner Dashboard

Go to: https://partners.shopify.com/192278600/apps/297703899137

### Update App URL:
- **App URL**: `https://app.ecomin.app`

### Update Allowed Redirection URLs:
Add these (replace any existing ones):
```
https://app.ecomin.app/auth/callback
https://app.ecomin.app/auth/shopify/callback
https://app.ecomin.app/api/auth/callback
```

**Click Save!**

---

## 9️⃣ Test Your App

### Test from terminal:
```bash
curl https://app.ecomin.app
```

### Test in browser:
1. Go to your Shopify admin
2. Click on Apps
3. Find "Ecomin Connector and Forms"
4. Click to open it

**You should now see your app dashboard!** 🎉

---

## ✅ Verify Everything

```bash
# Check if app is running
pm2 status
# or if using shopify app dev
ps aux | grep node

# Check Nginx
sudo systemctl status nginx

# Check SSL
curl -I https://app.ecomin.app

# Check DNS
dig app.ecomin.app
```

---

## 🎯 Summary

**What you now have:**
- ✅ Website: https://ecomin.app (unchanged)
- ✅ Shopify App: https://app.ecomin.app (new)
- ✅ Clean separation
- ✅ SSL on both
- ✅ Proper routing

---

## 🔄 Running the App Going Forward

### For Development:
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms
shopify app dev
```

### For Production:
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-cod-forms
npm run build
pm2 restart ecomin-app
```

---

Let me know when you've added the DNS record and I'll help you with the next steps!
