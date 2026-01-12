# 🔧 Manual Setup Steps - Execute on Your VPS

Since you haven't started yet, here's the **exact step-by-step** process:

---

## 📍 **You are here:** Connected to VPS via SSH

---

## **Step 1: Navigate to Project**
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify
```

---

## **Step 2: Pull Latest Changes**
```bash
git pull origin main
```

**Expected output:** `Already up to date` or files updated

---

## **Step 3: Update .env File**
```bash
nano .env
```

Find the line:
```env
SHOPIFY_APP_URL=https://ecomin.app
```

Change it to:
```env
SHOPIFY_APP_URL=https://app.ecomin.app
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## **Step 4: Get Your VPS IP**
```bash
curl ifconfig.me
```

**Write down this IP address!** You'll need it for DNS.

---

## **Step 5: Add DNS Record (Do this NOW)**

### Where: Your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

**Find your domain DNS settings for ecomin.app and add:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | app | [Your VPS IP from Step 4] | 3600 |

**Example:**
- If your IP is `123.45.67.89`, add:
  - Type: `A`
  - Name: `app`
  - Points to: `123.45.67.89`

**⏰ WAIT 5-10 minutes** after adding this record!

---

## **Step 6: Test DNS (after waiting)**
```bash
ping app.ecomin.app
```

**Expected:** Should ping your VPS IP address

**If it doesn't work:** Wait a few more minutes and try again

---

## **Step 7: Install Node.js (if not installed)**
```bash
node --version
```

**If shows v18 or higher:** ✅ Skip to Step 8

**If not installed or old version:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

---

## **Step 8: Install Dependencies**
```bash
npm install
```

**This takes 2-3 minutes.** Wait for it to complete.

---

## **Step 9: Setup Database**
```bash
npm run prisma:generate
npm run prisma:push
```

**Expected output:**
```
✔ Generated Prisma Client
✔ The database is now in sync with your schema
```

---

## **Step 10: Build the Application**
```bash
npm run build
```

**Wait for build to complete (1-2 minutes)**

---

## **Step 11: Create Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/app-ecomin
```

**Paste this ENTIRE block:**
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

**Save:** `Ctrl+X`, `Y`, `Enter`

---

## **Step 12: Enable Nginx Configuration**
```bash
sudo ln -s /etc/nginx/sites-available/app-ecomin /etc/nginx/sites-enabled/
sudo nginx -t
```

**Expected:** `syntax is ok` and `test is successful`

**Then restart Nginx:**
```bash
sudo systemctl reload nginx
```

---

## **Step 13: Get SSL Certificate**
```bash
sudo certbot --nginx -d app.ecomin.app
```

**Follow the prompts:**
- Enter your email when asked
- Type `Y` to agree to terms
- Choose option `2` (Redirect HTTP to HTTPS)

**Expected:** Certificate successfully obtained

---

## **Step 14: Install PM2 (if not installed)**
```bash
pm2 --version
```

**If not installed:**
```bash
sudo npm install -g pm2
```

---

## **Step 15: Start the Application**
```bash
pm2 start npm --name "ecomin-app" -- start
```

**Expected:** App shows as "online"

**Check status:**
```bash
pm2 status
```

**View logs:**
```bash
pm2 logs ecomin-app --lines 50
```

---

## **Step 16: Save PM2 Configuration**
```bash
pm2 save
pm2 startup
```

**Copy and run the command that PM2 shows!**

---

## **Step 17: Test from Terminal**
```bash
curl https://app.ecomin.app
```

**Expected:** Should return HTML content (not error)

---

## **Step 18: Update Shopify Partner Dashboard**

### Go to: https://partners.shopify.com/192278600/apps/297703899137

### Click "Configuration" tab

### Update these fields:

**1. App URL:**
```
https://app.ecomin.app
```

**2. Allowed redirection URL(s):**

**Delete all existing URLs** and add these three:
```
https://app.ecomin.app/auth/callback
https://app.ecomin.app/auth/shopify/callback
https://app.ecomin.app/api/auth/callback
```

**3. Click "Save" at the top!**

---

## **Step 19: Test Your App!**

1. Go to: https://admin.shopify.com/store/ecomin-store/apps
2. Find "Ecomin Connector and Forms"
3. Click to open it

**You should now see your app dashboard instead of the website!** 🎉

---

## 🎯 **Quick Summary Commands (Copy-Paste)**

If you want to run everything quickly:

```bash
# Navigate to project
cd /var/www/vhosts/ecomin.app/EcominShopify

# Pull latest changes
git pull origin main

# Update .env
sed -i 's|SHOPIFY_APP_URL=https://ecomin.app|SHOPIFY_APP_URL=https://app.ecomin.app|g' .env

# Get your IP
curl ifconfig.me

# (Add DNS record now with the IP above, then wait 5 minutes)

# Test DNS
ping app.ecomin.app

# Install dependencies
npm install

# Setup database
npm run prisma:generate
npm run prisma:push

# Build app
npm run build

# Create Nginx config (copy the config from Step 11 above into nano)
sudo nano /etc/nginx/sites-available/app-ecomin

# Enable and restart Nginx
sudo ln -s /etc/nginx/sites-available/app-ecomin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL
sudo certbot --nginx -d app.ecomin.app

# Start with PM2
pm2 start npm --name "ecomin-app" -- start
pm2 save
pm2 startup

# Test
curl https://app.ecomin.app
pm2 logs ecomin-app
```

---

## 🆘 **If You Get Stuck**

**Check PM2 logs:**
```bash
pm2 logs ecomin-app
```

**Check Nginx logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart everything:**
```bash
pm2 restart ecomin-app
sudo systemctl restart nginx
```

---

## ✅ **Checklist**

- [ ] Pulled latest code
- [ ] Updated .env file
- [ ] Added DNS A record for `app` subdomain
- [ ] Waited 5-10 minutes for DNS
- [ ] DNS ping works
- [ ] Installed dependencies
- [ ] Database set up
- [ ] App built
- [ ] Nginx configured
- [ ] SSL certificate obtained
- [ ] PM2 running the app
- [ ] Shopify Partner Dashboard updated
- [ ] App works in Shopify admin!

---

**Start with Step 1 and work through each step. Let me know where you are or if you get stuck!** 🚀
