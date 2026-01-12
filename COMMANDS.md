# Useful Commands - Ecomin Connector and Forms

Quick reference for common commands used during development and deployment.

## 📦 Package Management

```bash
# Install all dependencies
npm install

# Install a new package
npm install package-name

# Install a dev dependency
npm install --save-dev package-name

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🚀 Development

```bash
# Start development server (with Shopify CLI)
npm run dev

# Start development server (alternative)
shopify app dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗄️ Database (Prisma)

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database (no migration)
npm run prisma:push

# Create a migration
npm run prisma:migrate
# or
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# View database schema
npx prisma db pull
```

## 🧪 Testing

```bash
# Run credential generation test
npm run test:credentials

# Run specific test script
node scripts/generate_ecomin_credentials.js
```

## 🔧 Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix

# Format code with Prettier
npm run format
# or
npx prettier --write .

# Check formatting without making changes
npx prettier --check .

# Type check (if using TypeScript)
npx tsc --noEmit
```

## 🏗️ Shopify CLI

```bash
# Login to Shopify
shopify auth login

# Create new Shopify app
shopify app init

# Generate extension/component
shopify app generate

# Deploy to Shopify
npm run deploy
# or
shopify app deploy

# Link to existing app configuration
npm run config:link

# Use specific app configuration
npm run config:use

# Update app configuration
shopify app config push

# View app info
shopify app info

# Open app in Partner Dashboard
shopify app open

# Check Shopify CLI version
shopify version

# Update Shopify CLI
npm install -g @shopify/cli @shopify/app
```

## 🐛 Debugging

```bash
# View logs in development
npm run dev
# Logs appear in terminal

# Enable debug mode
DEBUG=* npm run dev

# Check specific module logs
DEBUG=prisma:* npm run dev

# View Shopify CLI logs
shopify app dev --verbose

# Test API endpoints
curl http://localhost:3000/api/ecomin/credentials
```

## 🔍 Inspection

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
npm list

# Check specific package version
npm list package-name

# View package information
npm view package-name

# Check project structure
tree -L 3 -I 'node_modules'
# or
ls -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g'
```

## 🧹 Cleanup

```bash
# Remove node_modules
rm -rf node_modules

# Remove build artifacts
rm -rf build
rm -rf .cache
rm -rf public/build

# Remove database files
rm -f prisma/*.db
rm -f prisma/*.db-journal

# Complete cleanup and reinstall
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
npm run prisma:push
```

## 🔄 Git Operations

```bash
# Initialize git repository
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/your-feature-name

# Switch branches
git checkout branch-name

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## 🚢 Deployment

### Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret

# Deploy
git push heroku main

# Run commands on Heroku
heroku run npm run prisma:push

# View logs
heroku logs --tail

# Open app
heroku open
```

### Vercel

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel list
```

### Docker

```bash
# Build Docker image
docker build -t ecomin-app .

# Run container
docker run -p 3000:3000 ecomin-app

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Execute command in container
docker-compose exec app npm run prisma:push
```

## 🔐 Environment Management

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
# or
vim .env

# Print environment variables (be careful with secrets!)
printenv | grep SHOPIFY

# Load environment from file (bash)
export $(cat .env | xargs)

# Validate environment setup
node -e "console.log(process.env.SHOPIFY_API_KEY ? '✓ API Key set' : '✗ API Key missing')"
```

## 📊 Performance

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Check for unused dependencies
npx depcheck

# Measure build time
time npm run build

# Profile Node.js performance
node --prof server.js
```

## 🔧 Maintenance

```bash
# Check for security vulnerabilities
npm audit

# Update all packages to latest (careful!)
npx npm-check-updates -u
npm install

# Clean npm cache
npm cache clean --force

# Verify package integrity
npm ci

# Prune unused packages
npm prune
```

## 🎯 Quick Workflows

### Fresh Start
```bash
rm -rf node_modules package-lock.json prisma/*.db
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

### Quick Test
```bash
npm run test:credentials
npm run dev
```

### Production Deploy (Example: Heroku)
```bash
git add .
git commit -m "Deploy: your changes"
git push heroku main
heroku run npm run prisma:push
heroku logs --tail
```

### Database Reset
```bash
rm -f prisma/*.db
npm run prisma:push
npm run dev
```

## 🆘 Emergency Commands

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (find PID)
taskkill /PID <PID> /F         # Windows (kill process)

# Fix permission issues
sudo chown -R $USER:$USER .
chmod -R 755 .

# Fix npm permissions
sudo chown -R $USER:$(id -gn $USER) ~/.npm
sudo chown -R $USER:$(id -gn $USER) ~/.config
```

## 📱 Mobile Testing (with ngrok)

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3000

# Use the ngrok URL in Shopify Partner Dashboard
```

## 🔗 Useful Shortcuts

```bash
# Create alias for common commands (add to ~/.bashrc or ~/.zshrc)
alias dev="npm run dev"
alias build="npm run build"
alias deploy="npm run deploy"
alias db:push="npm run prisma:push"
alias db:studio="npx prisma studio"
alias clean="rm -rf node_modules package-lock.json && npm install"
```

## 📚 Documentation Generation

```bash
# Generate JSDoc documentation (if configured)
npx jsdoc -c jsdoc.json

# Generate API documentation
# (requires additional tools like Swagger/OpenAPI)
```

## 🎓 Learning Commands

```bash
# Explain a command
npm explain package-name

# Get help for npm commands
npm help

# Get help for Shopify CLI
shopify help

# List all npm scripts
npm run
```

---

## 💡 Tips

- **Use npm scripts**: Prefer `npm run scriptname` over direct commands
- **Environment files**: Never commit `.env` files
- **Git branches**: Use feature branches for development
- **Regular backups**: Back up your database before migrations
- **Test locally**: Always test before deploying to production
- **Check logs**: When debugging, always check console/terminal logs

---

**Quick Command Reference Created**: 2024-01-03  
**For Project**: Ecomin Connector and Forms
