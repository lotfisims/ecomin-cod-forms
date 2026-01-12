# Project Structure - Ecomin Connector and Forms

This document provides a comprehensive overview of the project structure and file organization.

## 📁 Directory Structure

```
ecomin-connector-and-forms/
├── app/                          # Application source code
│   ├── components/               # React components
│   │   ├── settings/            # Settings sub-components
│   │   │   ├── GeneralSettings.jsx
│   │   │   ├── PixelsSettings.jsx
│   │   │   └── EcominAPISettings.jsx
│   │   ├── CODFormTab.jsx       # COD Form tab component
│   │   ├── SalesBoosterTab.jsx  # Sales Booster tab component
│   │   └── SettingsTab.jsx      # Settings tab wrapper
│   │
│   ├── routes/                   # Remix routes (pages & API)
│   │   ├── app._index.jsx       # Main dashboard page
│   │   ├── app.jsx              # App layout wrapper
│   │   ├── auth.$.jsx           # Auth catch-all route
│   │   ├── auth.login/          # Login page
│   │   │   └── route.jsx
│   │   ├── api.webhooks.jsx     # Webhook handler
│   │   └── api.ecomin.credentials.jsx  # Ecomin API endpoint
│   │
│   ├── utils/                    # Utility functions
│   │   ├── logger.js            # Logging utility
│   │   └── credentials.js       # Credential generation utils
│   │
│   ├── db.server.js             # Prisma database client
│   ├── shopify.server.js        # Shopify app configuration
│   ├── entry.client.jsx         # Client-side entry point
│   ├── entry.server.jsx         # Server-side entry point
│   └── root.jsx                 # Root React component
│
├── prisma/                       # Database schema and migrations
│   └── schema.prisma            # Prisma schema definition
│
├── scripts/                      # Utility scripts
│   └── generate_ecomin_credentials.js  # Test script
│
├── public/                       # Static files
│   └── robots.txt               # SEO robots file
│
├── .github/                      # GitHub specific files
│   └── workflows/               # CI/CD workflows (optional)
│
├── node_modules/                 # Dependencies (not in git)
├── build/                        # Production build (not in git)
│
├── .env                          # Environment variables (not in git)
├── .env.example                 # Environment template
├── .env.local.example           # Local development template
├── .gitignore                   # Git ignore rules
├── .dockerignore                # Docker ignore rules
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
│
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── tsconfig.json                # TypeScript configuration
├── vite.config.js               # Vite build configuration
├── remix.config.js              # Remix configuration
├── shopify.app.toml             # Shopify app configuration
│
├── README.md                    # Main documentation
├── QUICKSTART.md                # Quick start guide
├── DEPLOYMENT.md                # Deployment instructions
├── CONTRIBUTING.md              # Contribution guidelines
├── CHANGELOG.md                 # Version history
├── PROJECT_STRUCTURE.md         # This file
├── LICENSE                      # MIT License
└── AGENTS.md                    # AI agent instructions (existing)
```

## 📄 Key Files Explained

### Configuration Files

#### `package.json`
- Project metadata and dependencies
- npm scripts for development, build, and deployment
- Engine requirements (Node.js >= 18)

#### `shopify.app.toml`
- Shopify app configuration
- OAuth scopes definition
- Webhook subscriptions
- Redirect URLs

#### `.env` (create from `.env.example`)
- Shopify API credentials
- Database connection string
- App URL configuration
- Environment-specific settings

#### `tsconfig.json`
- TypeScript compiler options
- Path aliases configuration
- Module resolution settings

#### `vite.config.js`
- Vite build tool configuration
- Remix plugin setup
- Development server settings
- Path aliases

### Application Files

#### `app/shopify.server.js`
- Shopify app initialization
- Authentication setup
- Webhook registration
- Session storage configuration

#### `app/db.server.js`
- Prisma client initialization
- Database connection management
- Development vs production configuration

#### `app/routes/app._index.jsx`
- Main dashboard component
- Tab navigation logic
- Layout structure

#### `app/routes/api.ecomin.credentials.jsx`
- RESTful API endpoint for credentials
- GET: Retrieve credentials
- POST: Generate credentials
- Error handling and CORS

### Database Files

#### `prisma/schema.prisma`
- Database schema definition
- Models:
  - `Session`: Shopify session data
  - `EcominCredentials`: API credentials
- Database provider configuration

### Component Files

#### `app/components/settings/EcominAPISettings.jsx`
- Full-featured credential management UI
- API calls with timeout handling
- Error handling and user feedback
- Network status monitoring
- Loading states

#### `app/components/CODFormTab.jsx` & `SalesBoosterTab.jsx`
- Placeholder components for future features
- Informational UI with feature lists

### Utility Files

#### `app/utils/credentials.js`
- Credential generation functions
- Format validation
- Secret masking for display

#### `app/utils/logger.js`
- Consistent logging across the app
- Log level management
- Timestamp formatting

#### `scripts/generate_ecomin_credentials.js`
- Standalone testing script
- Credential generation testing
- Format verification
- Uniqueness validation

## 🔄 Data Flow

### Authentication Flow
```
User → Login Page → Shopify OAuth → Callback → Session Storage → Dashboard
```

### Credential Generation Flow
```
User clicks "Generate" 
  → EcominAPISettings component
  → POST /api/ecomin/credentials
  → authenticate.admin() middleware
  → Generate credentials (crypto.randomBytes)
  → Save to database (Prisma)
  → Return to frontend
  → Display in UI
```

### Credential Retrieval Flow
```
User clicks "Load"
  → EcominAPISettings component
  → GET /api/ecomin/credentials
  → authenticate.admin() middleware
  → Query database (Prisma)
  → Return credentials
  → Display in UI
```

## 🗄️ Database Schema

### Session Table
```prisma
model Session {
  id          String    @id
  shop        String
  state       String
  isOnline    Boolean   @default(false)
  scope       String?
  expires     DateTime?
  accessToken String
  userId      BigInt?
  // ... other Shopify session fields
}
```

### EcominCredentials Table
```prisma
model EcominCredentials {
  id         Int      @id @default(autoincrement())
  shop       String   @unique
  apiKey     String   @unique
  apiSecret  String   @unique
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 🎨 UI Component Hierarchy

```
App (root.jsx)
└── AppProvider (app.jsx)
    └── Dashboard (app._index.jsx)
        └── Tabs
            ├── CODFormTab
            │   └── [Placeholder content]
            │
            ├── SalesBoosterTab
            │   └── [Placeholder content]
            │
            └── SettingsTab
                └── Sub-tabs
                    ├── GeneralSettings
                    │   └── Store info display
                    │
                    ├── PixelsSettings
                    │   └── [Placeholder for future]
                    │
                    └── EcominAPISettings
                        ├── Action buttons
                        ├── Loading states
                        ├── Error handling
                        ├── Credentials display
                        └── Security warnings
```

## 🔌 API Endpoints

### `/api/ecomin/credentials`
- **Methods**: GET, POST, OPTIONS
- **Authentication**: Required (Shopify Admin)
- **CORS**: Enabled
- **Response Format**: JSON

```javascript
// GET Response
{
  "success": true,
  "data": {
    "apiKey": "ek_...",
    "apiSecret": "sk_...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}

// POST Response
{
  "success": true,
  "data": { /* same as GET */ },
  "message": "API credentials generated successfully!"
}

// Error Response
{
  "success": false,
  "error": "Error type",
  "message": "User-friendly error message"
}
```

### `/api/webhooks`
- **Method**: POST
- **Purpose**: Handle Shopify webhooks
- **Topics**: 
  - app/uninstalled
  - app/scopes_update

## 🛠️ npm Scripts

```json
{
  "dev": "shopify app dev",              // Start development server
  "build": "shopify app build",          // Build for production
  "deploy": "shopify app deploy",        // Deploy to Shopify
  "prisma:generate": "prisma generate",  // Generate Prisma client
  "prisma:migrate": "prisma migrate dev", // Run migrations
  "prisma:push": "prisma db push",       // Push schema to DB
  "test:credentials": "node scripts/generate_ecomin_credentials.js"
}
```

## 🔐 Security Features

1. **Authentication**: Shopify OAuth with session management
2. **Authorization**: Shop-specific data isolation
3. **Credential Security**: 
   - Cryptographically secure generation
   - Unique constraints in database
   - Secure storage
4. **CORS**: Properly configured for API endpoints
5. **Environment Variables**: Sensitive data not in code

## 📦 Dependencies Overview

### Core Dependencies
- `@shopify/shopify-app-remix` - Shopify app framework
- `@shopify/polaris` - UI components
- `@remix-run/react` - React framework
- `@prisma/client` - Database ORM
- `react` & `react-dom` - React library

### Development Dependencies
- `@remix-run/dev` - Remix development tools
- `@shopify/app` - Shopify CLI
- `typescript` - Type checking
- `vite` - Build tool
- `eslint` & `prettier` - Code quality

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env`
3. **Set up database**: `npm run prisma:generate && npm run prisma:push`
4. **Start development**: `npm run dev`

## 📖 Documentation Files

- **README.md** - Main documentation (comprehensive)
- **QUICKSTART.md** - 10-minute setup guide
- **DEPLOYMENT.md** - Deployment instructions for various platforms
- **CONTRIBUTING.md** - Contribution guidelines and standards
- **CHANGELOG.md** - Version history and release notes
- **PROJECT_STRUCTURE.md** - This file (architecture overview)

## 🎯 Next Steps for Development

1. Implement COD Form builder
2. Add Sales Booster features
3. Integrate pixel tracking
4. Add unit tests
5. Improve error boundaries
6. Add analytics dashboard

---

**Last Updated**: 2024-01-03
