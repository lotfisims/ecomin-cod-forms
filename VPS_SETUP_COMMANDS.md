# 🚀 VPS Setup Commands - Execute These Now

You're currently in: `/var/www/vhosts/ecomin.app/EcominShopify/ecomin-connector-and-forms`

Follow these commands in order:

---

## ✅ Step 1: Verify Node.js Installation

```bash
node --version
npm --version
```

**Expected:** Node.js v18.x or higher

**If not installed:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## ✅ Step 2: Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit with nano
nano .env
```

**Paste this into .env:**
```env
SHOPIFY_API_KEY=your_client_id_here
SHOPIFY_API_SECRET=your_client_secret_here
SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
SHOPIFY_APP_URL=https://ecomin.app
DATABASE_URL=file:./prod.sqlite
NODE_ENV=production
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## ✅ Step 3: Install Dependencies

```bash
npm install
```

This will take 2-3 minutes. Wait for it to complete.

---

## ✅ Step 4: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database
npm run prisma:push
```

**Expected output:**
```
✓ Prisma Client generated
✓ Database synchronized
```

---

## ✅ Step 5: Build the Application

```bash
npm run build
```

**Expected:** Build completes without errors

---

## ✅ Step 6: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

---

## ✅ Step 7: Start the Application

```bash
# Start the app with PM2
pm2 start npm --name "ecomin-app" -- start

# View status
pm2 status

# View logs
pm2 logs ecomin-app
```

**Expected:** App shows as "online"

---

## ✅ Step 8: Save PM2 Configuration

```bash
# Save current processes
pm2 save

# Set PM2 to start on boot
pm2 startup

# Follow the command it shows (copy and run it)
```

---

## ✅ Step 9: Test the Application

```bash
# Check if app is running on port 3000
curl http://localhost:3000

# Or check with netstat
sudo netstat -tulpn | grep :3000
```

**Expected:** Should show node process on port 3000

---

## ✅ Step 10: Configure Nginx

### Check if Nginx is installed:
```bash
nginx -v
```

**If not installed:**
```bash
sudo apt install nginx -y
```

### Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/ecomin-app
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name ecomin.app www.ecomin.app;

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

**Save and exit** (Ctrl+X, Y, Enter)

### Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ecomin-app /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## ✅ Step 11: Set Up SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d ecomin.app -d www.ecomin.app
```

**Follow the prompts:**
- Enter your email
- Agree to terms
- Choose option 2: Redirect HTTP to HTTPS

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

## ✅ Step 12: Configure Firewall

```bash
# Install UFW (if not installed)
sudo apt install ufw -y

# Allow SSH (IMPORTANT - Don't lock yourself out!)
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## ✅ Step 13: Verify Everything is Working

```bash
# Check PM2 status
pm2 status

# Check app logs
pm2 logs ecomin-app --lines 50

# Check Nginx status
sudo systemctl status nginx

# Check if SSL is working
curl -I https://ecomin.app
```

---

## ✅ Step 14: Test Your App

Open your browser and go to:
**https://ecomin.app**

You should see your Shopify app!

---

## 🔧 Useful PM2 Commands

```bash
# View logs
pm2 logs ecomin-app

# View last 100 lines
pm2 logs ecomin-app --lines 100

# Monitor in real-time
pm2 monit

# Restart app
pm2 restart ecomin-app

# Stop app
pm2 stop ecomin-app

# Start app
pm2 start ecomin-app

# Delete app from PM2
pm2 delete ecomin-app

# View detailed info
pm2 show ecomin-app
```

---

## 🔄 Future Updates

When you push changes to GitHub:

```bash
# Navigate to project directory
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-connector-and-forms

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Update database (if schema changed)
npm run prisma:generate
npm run prisma:push

# Restart app
pm2 restart ecomin-app

# Check logs
pm2 logs ecomin-app
```

### Quick Update Script

Create a file for easy updates:
```bash
nano update-app.sh
```

**Paste this:**
```bash
#!/bin/bash
echo "🔄 Updating Ecomin App..."
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-connector-and-forms
git pull origin main
npm install
npm run prisma:generate
npm run build
pm2 restart ecomin-app
echo "✅ Update complete!"
pm2 logs ecomin-app --lines 20
```

**Make it executable:**
```bash
chmod +x update-app.sh
```

**Use it:**
```bash
./update-app.sh
```

---

## 🐛 Troubleshooting

### If app won't start:
```bash
pm2 logs ecomin-app
```

### If port 3000 is already in use:
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
pm2 restart ecomin-app
```

### If Nginx shows error:
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### If database errors:
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify/ecomin-connector-and-forms
npm run prisma:generate
npm run prisma:push
pm2 restart ecomin-app
```

### Check disk space:
```bash
df -h
```

### Check memory:
```bash
free -m
```

---

## 📊 Monitoring

```bash
# View all PM2 processes
pm2 list

# Monitor resources
pm2 monit

# View app info
pm2 info ecomin-app

# View system logs
journalctl -u nginx -f
```

---

## ✅ Final Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] .env file created with credentials
- [ ] Database generated and pushed
- [ ] App built successfully
- [ ] PM2 installed and app started
- [ ] PM2 saved and set to auto-start
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] Firewall configured
- [ ] App accessible at https://ecomin.app
- [ ] Can log in and use the app

---

## 🎉 Success!

Your Shopify app should now be live at:
**https://ecomin.app**

### Test these features:
1. ✅ Access the dashboard
2. ✅ Navigate through tabs
3. ✅ Go to Settings & Integration → Ecomin API
4. ✅ Generate API credentials
5. ✅ Load existing credentials

---

Need help? Check the logs:
```bash
pm2 logs ecomin-app
```

Good luck! 🚀
