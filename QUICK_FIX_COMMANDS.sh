#!/bin/bash
# Quick Fix Script for Ecomin App Subdomain Setup
# Run this on your VPS

echo "🚀 Ecomin App - Subdomain Setup Script"
echo "========================================"
echo ""

# Navigate to project directory
cd /var/www/vhosts/ecomin.app/EcominShopify

echo "✅ Step 1: Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo "✅ Step 2: Updating .env file..."
# Update .env file
sed -i 's|SHOPIFY_APP_URL=https://ecomin.app|SHOPIFY_APP_URL=https://app.ecomin.app|g' .env

echo ""
echo "✅ Step 3: Your VPS IP address is:"
curl -s ifconfig.me
echo ""

echo ""
echo "⚠️  IMPORTANT: Add DNS Record"
echo "Go to your domain provider and add:"
echo "  Type: A"
echo "  Name: app"
echo "  Value: (the IP shown above)"
echo "  TTL: 3600"
echo ""
read -p "Press Enter when you've added the DNS record and waited 5 minutes..."

echo ""
echo "✅ Step 4: Testing DNS..."
if ping -c 1 app.ecomin.app &> /dev/null
then
    echo "✓ DNS is working!"
else
    echo "✗ DNS not propagated yet. Wait a few more minutes and run this script again."
    exit 1
fi

echo ""
echo "✅ Step 5: Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/app-ecomin > /dev/null <<EOF
server {
    listen 80;
    server_name app.ecomin.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo ""
echo "✅ Step 6: Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/app-ecomin /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "✅ Step 7: Getting SSL certificate..."
sudo certbot --nginx -d app.ecomin.app --non-interactive --agree-tos --email admin@ecomin.app --redirect

echo ""
echo "✅ Step 8: Installing dependencies..."
npm install

echo ""
echo "✅ Step 9: Setting up database..."
npm run prisma:generate
npm run prisma:push

echo ""
echo "✅ Step 10: Building application..."
npm run build

echo ""
echo "✅ Step 11: Starting application with PM2..."
pm2 delete ecomin-app 2>/dev/null || true
pm2 start npm --name "ecomin-app" -- start
pm2 save

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Go to: https://partners.shopify.com/192278600/apps/297703899137"
echo "2. Update App URL to: https://app.ecomin.app"
echo "3. Update Allowed redirection URLs to:"
echo "   - https://app.ecomin.app/auth/callback"
echo "   - https://app.ecomin.app/auth/shopify/callback"
echo "   - https://app.ecomin.app/api/auth/callback"
echo "4. Click Save"
echo "5. Test your app at: https://admin.shopify.com/store/ecomin-store/apps/ecomin-connector"
echo ""
echo "Check app status: pm2 status"
echo "View logs: pm2 logs ecomin-app"
