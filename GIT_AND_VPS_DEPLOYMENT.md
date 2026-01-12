# 🚀 Git Repository Setup & VPS Deployment Guide

Complete guide for pushing your project to Git and deploying to your VPS server.

---

## 📦 Part 1: Prepare Project for Git

### Step 1: Verify .gitignore is Correct

Your `.gitignore` is already configured to exclude sensitive files:
```
node_modules/
.env
*.db
*.sqlite
.DS_Store
.cache/
build/
public/build/
.shopify/
dist/
```

✅ **This ensures your `.env` file and credentials won't be uploaded to Git!**

### Step 2: Initialize Git Repository (if not done)

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Step 3: Add All Files to Git

```bash
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status
```

**Verify these files are NOT included:**
- ❌ `.env` (contains your secrets)
- ❌ `node_modules/` (too large, will be installed on VPS)
- ❌ `*.db` or `*.sqlite` (database files)
- ❌ `build/` (will be built on VPS)

**Files that SHOULD be included:**
- ✅ `.env.example` (template without secrets)
- ✅ All `.js`, `.jsx`, `.md` files
- ✅ `package.json`, `package-lock.json`
- ✅ Configuration files (`.eslintrc.cjs`, `vite.config.js`, etc.)
- ✅ `prisma/schema.prisma`

### Step 4: Create Initial Commit

```bash
# Commit all files
git commit -m "Initial commit: Ecomin Connector and Forms Shopify app"
```

---

## 🌐 Part 2: Create Git Repository

### Option A: GitHub

1. **Go to GitHub**: https://github.com/new

2. **Create new repository:**
   - Repository name: `ecomin-connector-forms` (or your choice)
   - Description: "Shopify app for COD forms and Ecomin integration"
   - Visibility: **Private** (recommended for app with credentials)
   - ❌ Don't initialize with README (you already have one)

3. **Copy the repository URL** (will look like):
   ```
   https://github.com/yourusername/ecomin-connector-forms.git
   ```

4. **Add remote and push:**
   ```bash
   # Add remote repository
   git remote add origin https://github.com/yourusername/ecomin-connector-forms.git
   
   # Push to main branch
   git branch -M main
   git push -u origin main
   ```

### Option B: GitLab

1. **Go to GitLab**: https://gitlab.com/projects/new

2. **Create project:**
   - Project name: `ecomin-connector-forms`
   - Visibility: **Private**
   - Initialize with README: **No**

3. **Add remote and push:**
   ```bash
   git remote add origin https://gitlab.com/yourusername/ecomin-connector-forms.git
   git branch -M main
   git push -u origin main
   ```

### Option C: Bitbucket

1. **Go to Bitbucket**: https://bitbucket.org/repo/create

2. **Create repository:**
   - Repository name: `ecomin-connector-forms`
   - Access level: **Private**

3. **Add remote and push:**
   ```bash
   git remote add origin https://bitbucket.org/yourusername/ecomin-connector-forms.git
   git branch -M main
   git push -u origin main
   ```

---

## 🖥️ Part 3: Deploy to VPS Server

### Prerequisites on VPS

Your VPS should have:
- ✅ Ubuntu 20.04+ or similar Linux distribution
- ✅ SSH access
- ✅ Sudo privileges

---

### Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

### Step 2: Install Node.js (if not installed)

```bash
# Update package list
sudo apt update

# Install Node.js 18.x (required)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x or higher
npm --version
```

### Step 3: Install Git (if not installed)

```bash
sudo apt install git -y
git --version
```

### Step 4: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 5: Clone Your Repository

```bash
# Navigate to where you want to store the app
cd /var/www
# or
cd ~/apps

# Clone your repository
git clone https://github.com/yourusername/ecomin-connector-forms.git

# Enter the directory
cd ecomin-connector-forms
```

**If private repository, you'll need authentication:**

**Option A: HTTPS with Personal Access Token**
```bash
# GitHub: Create token at https://github.com/settings/tokens
# GitLab: Create token at https://gitlab.com/-/profile/personal_access_tokens

git clone https://YOUR_TOKEN@github.com/yourusername/ecomin-connector-forms.git
```

**Option B: SSH Key**
```bash
# Generate SSH key on VPS
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: https://github.com/settings/keys
# Then clone with SSH
git clone git@github.com:yourusername/ecomin-connector-forms.git
```

### Step 6: Create Environment File on VPS

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
# or
vim .env
```

**Add your production values:**
```env
SHOPIFY_API_KEY=your_client_id_here
SHOPIFY_API_SECRET=your_client_secret_here
SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
SHOPIFY_APP_URL=https://ecomin.app
DATABASE_URL=file:./prod.sqlite
NODE_ENV=production
```

**For PostgreSQL (recommended for production):**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/ecomin_db
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter` in nano)

### Step 7: Install Dependencies

```bash
# Install all dependencies
npm install

# This will take a few minutes
```

### Step 8: Set Up Database

#### Option A: SQLite (Quick Setup)
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

#### Option B: PostgreSQL (Recommended for Production)

**Install PostgreSQL:**
```bash
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql

# In PostgreSQL console:
CREATE DATABASE ecomin_db;
CREATE USER ecomin_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecomin_db TO ecomin_user;
\q

# Update schema for PostgreSQL
nano prisma/schema.prisma
```

**Change datasource:**
```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

**Update .env:**
```env
DATABASE_URL=postgresql://ecomin_user:your_secure_password@localhost:5432/ecomin_db
```

**Run migrations:**
```bash
npm run prisma:generate
npm run prisma:push
```

### Step 9: Build the Application

```bash
# Build for production
npm run build
```

**Expected output:**
```
✓ Built in XXXms
```

### Step 10: Set Up Nginx Reverse Proxy

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/ecomin-app
```

**Add this configuration:**
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

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/ecomin-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 11: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d ecomin.app -d www.ecomin.app

# Follow the prompts
# Choose option 2: Redirect HTTP to HTTPS
```

**Auto-renewal test:**
```bash
sudo certbot renew --dry-run
```

### Step 12: Start Application with PM2

```bash
# Start the app
pm2 start npm --name "ecomin-app" -- start

# Or if you have a custom start script:
pm2 start npm --name "ecomin-app" -- run start

# Save PM2 process list
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command it shows
```

**Useful PM2 commands:**
```bash
# View logs
pm2 logs ecomin-app

# View status
pm2 status

# Restart app
pm2 restart ecomin-app

# Stop app
pm2 stop ecomin-app

# Monitor
pm2 monit
```

---

## 🔄 Part 4: Future Updates (Git Pull Workflow)

When you make changes and want to update your VPS:

### On Your Local Machine:
```bash
# Commit changes
git add .
git commit -m "Description of changes"
git push origin main
```

### On Your VPS:
```bash
# Navigate to app directory
cd /var/www/ecomin-connector-forms

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild if needed
npm run build

# Run database migrations if schema changed
npm run prisma:generate
npm run prisma:push

# Restart the app
pm2 restart ecomin-app

# Check logs
pm2 logs ecomin-app
```

**Quick update script** (create this file):
```bash
# Create update script
nano update.sh
```

```bash
#!/bin/bash
echo "Updating Ecomin App..."
git pull origin main
npm install
npm run prisma:generate
npm run build
pm2 restart ecomin-app
echo "Update complete! Checking status..."
pm2 status
```

**Make executable and use:**
```bash
chmod +x update.sh
./update.sh
```

---

## 🔐 Part 5: Security Best Practices

### Firewall Setup
```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
sudo ufw status
```

### Secure SSH
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change these settings:
PermitRootLogin no
PasswordAuthentication no  # Only if you have SSH keys
Port 2222  # Change default port (optional)

# Restart SSH
sudo systemctl restart ssh
```

### Environment Variables Security
```bash
# Ensure .env has correct permissions
chmod 600 .env

# Verify
ls -la .env
```

---

## 📊 Part 6: Monitoring & Maintenance

### Monitor Application
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs ecomin-app --lines 100

# Check memory usage
pm2 show ecomin-app
```

### Monitor Server
```bash
# System resources
htop
# or
top

# Disk usage
df -h

# Memory usage
free -m
```

### Database Backup (if using SQLite)
```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
cp /var/www/ecomin-connector-forms/prisma/prod.sqlite ~/backups/prod-$(date +%Y%m%d).sqlite

# Automated backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
backup_dir=~/backups
db_path=/var/www/ecomin-connector-forms/prisma/prod.sqlite
cp $db_path $backup_dir/prod-$(date +%Y%m%d-%H%M%S).sqlite
# Keep only last 7 days
find $backup_dir -name "prod-*.sqlite" -mtime +7 -delete
```

**Schedule with cron:**
```bash
chmod +x ~/backup-db.sh
crontab -e

# Add this line for daily backup at 2 AM:
0 2 * * * ~/backup-db.sh
```

---

## ✅ Deployment Checklist

### Before First Deploy:
- [ ] Git repository created and pushed
- [ ] VPS has Node.js 18+ installed
- [ ] Git installed on VPS
- [ ] Repository cloned to VPS
- [ ] `.env` file created with production values
- [ ] Dependencies installed (`npm install`)
- [ ] Database set up and migrated
- [ ] Application built (`npm run build`)
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] PM2 running the application
- [ ] Firewall configured

### After Deploy:
- [ ] App accessible at https://ecomin.app
- [ ] SSL certificate working (green padlock)
- [ ] Can log in to Shopify app
- [ ] Dashboard loads correctly
- [ ] Can generate API credentials
- [ ] Webhooks working
- [ ] PM2 process saved and set to auto-start

### Update Shopify Partner Dashboard:
- [ ] App URL: `https://ecomin.app`
- [ ] Redirect URLs updated to production domain
- [ ] App scopes verified

---

## 🐛 Troubleshooting

### App not starting
```bash
# Check PM2 logs
pm2 logs ecomin-app

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart PM2
pm2 restart ecomin-app
```

### Database errors
```bash
# Regenerate Prisma client
cd /var/www/ecomin-connector-forms
npm run prisma:generate
npm run prisma:push
pm2 restart ecomin-app
```

### Nginx errors
```bash
# Check Nginx status
sudo systemctl status nginx

# Check configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL issues
```bash
# Renew SSL certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal
```

---

## 📞 Quick Reference Commands

```bash
# Git commands
git pull origin main                  # Update code
git status                            # Check changes
git log --oneline -10                # View recent commits

# Application commands
npm install                           # Install dependencies
npm run build                         # Build for production
npm run prisma:push                  # Update database

# PM2 commands
pm2 restart ecomin-app               # Restart app
pm2 logs ecomin-app                  # View logs
pm2 status                           # Check status
pm2 monit                            # Monitor resources

# System commands
sudo systemctl restart nginx         # Restart Nginx
sudo certbot renew                   # Renew SSL
htop                                 # Monitor system
```

---

## 🎯 Summary

**Your deployment workflow:**
1. ✅ Push code to Git
2. ✅ SSH into VPS
3. ✅ Pull latest changes
4. ✅ Run update script
5. ✅ Verify app is running

**That's it!** 🚀

---

Need help with any step? Let me know!
