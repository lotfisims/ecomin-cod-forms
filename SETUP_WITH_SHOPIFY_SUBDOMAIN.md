# 🚀 Setup with shopify.ecomin.app Subdomain

## Quick Setup Commands

### **1. Update .env file:**
```bash
cd /var/www/vhosts/ecomin.app/EcominShopify
nano .env
```

**Paste this:**
```env
SHOPIFY_API_KEY=your_client_id_here
SHOPIFY_API_SECRET=your_client_secret_here
SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
SHOPIFY_APP_URL=https://shopify.ecomin.app
DATABASE_URL=file:./prod.sqlite
NODE_ENV=production
```

Save: `Ctrl+X`, `Y`, `Enter`

---

### **2. Update shopify.app.toml:**
```bash
nano shopify.app.toml
```

**Change these lines:**
```toml
application_url = "https://shopify.ecomin.app"

[auth]
redirect_urls = [
  "https://shopify.ecomin.app/auth/callback",
  "https://shopify.ecomin.app/auth/shopify/callback",
  "https://shopify.ecomin.app/api/auth/callback"
]
```

Save: `Ctrl+X`, `Y`, `Enter`

---

### **3. Get your VPS IP:**
```bash
curl ifconfig.me
```

Write down this IP!

---

### **4. Add DNS Record:**
Go to your domain provider and add:
- **Type**: A
- **Name**: shopify
- **Value**: [Your VPS IP]
- **TTL**: 3600

**Wait 5-10 minutes for DNS propagation**

---

### **5. Test DNS:**
```bash
ping shopify.ecomin.app
```

Should return your VPS IP.

---

### **6. Install dependencies:**
```bash
npm install
```

---

### **7. Setup database:**
```bash
npm run prisma:generate
npm run prisma:push
```

---

### **8. Build app:**
```bash
npm run build
```

---

### **9. Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/shopify-ecomin
```

**Paste this:**
```nginx
server {
    listen 80;
    server_name shopify.ecomin.app;

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

---

### **10. Enable Nginx site:**
```bash
sudo ln -s /etc/nginx/sites-available/shopify-ecomin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### **11. Get SSL certificate:**
```bash
sudo certbot --nginx -d shopify.ecomin.app
```

Follow prompts and choose option 2 (Redirect to HTTPS)

---

### **12. Start the app:**
```bash
pm2 start npm --name "ecomin-app" -- start
pm2 save
pm2 startup
```

Copy and run the command that PM2 shows.

---

### **13. Verify it's running:**
```bash
pm2 status
pm2 logs ecomin-app
curl https://shopify.ecomin.app
```

---

### **14. Update Shopify Partner Dashboard:**

Go to: https://partners.shopify.com/192278600/apps/297703899137

**Update:**
- **App URL**: `https://shopify.ecomin.app`
- **Allowed redirection URLs**:
  ```
  https://shopify.ecomin.app/auth/callback
  https://shopify.ecomin.app/auth/shopify/callback
  https://shopify.ecomin.app/api/auth/callback
  ```

Click **Save**!

---

### **15. Test your app:**

Go to: https://admin.shopify.com/store/ecomin-store/apps/ecomin-connector

You should see your app dashboard! 🎉

---

## ✅ Quick Checklist

- [ ] .env updated with shopify.ecomin.app
- [ ] shopify.app.toml updated
- [ ] DNS A record added for "shopify"
- [ ] DNS propagated (ping works)
- [ ] Dependencies installed
- [ ] Database set up
- [ ] App built
- [ ] Nginx configured
- [ ] SSL certificate obtained
- [ ] PM2 running the app
- [ ] Shopify Partner Dashboard updated
- [ ] App works!

---

## 🔧 Useful Commands

```bash
# Check app status
pm2 status

# View logs
pm2 logs ecomin-app

# Restart app
pm2 restart ecomin-app

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Test SSL
curl -I https://shopify.ecomin.app
```

---

Good luck! 🚀
