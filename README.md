# Ecomin Connector and Forms

A comprehensive Shopify app built with React Router that provides COD (Cash on Delivery) forms, sales boosting tools, and seamless Ecomin API integration for your Shopify store.

## 🚀 Features

### Core Functionality

- **COD Form Management** (Coming Soon)
  - Custom form builder with drag-and-drop interface
  - Form validation and conditional logic
  - Integration with checkout process
  - Order management for COD transactions

- **Sales Booster** (Coming Soon)
  - Upsell and cross-sell recommendations
  - Limited-time offer popups
  - Urgency timers and stock counters
  - Cart abandonment recovery
  - A/B testing for campaigns

- **Settings & Integration**
  - General app settings and store configuration
  - Pixel tracking (Facebook, TikTok, Google Analytics) - Coming Soon
  - **Ecomin API Integration** - Fully Functional
    - Generate secure API credentials
    - Load existing credentials
    - Comprehensive error handling
    - Network status monitoring

### Technical Features

- ✅ Shopify Admin authentication and authorization
- ✅ Webhook support (app/uninstalled, app/scopes_update)
- ✅ SQLite database with Prisma ORM
- ✅ Secure credential generation (cryptographically secure random bytes)
- ✅ CORS-enabled API endpoints
- ✅ Comprehensive error handling and logging
- ✅ Loading states and timeout handling
- ✅ React Router for navigation
- ✅ Shopify Polaris UI components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 18.0.0)
- **npm** or **yarn**
- **Shopify CLI** (>= 3.x)
- **Shopify Partner Account**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ecomin-connector-and-forms
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Shopify app credentials:

```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SCOPES=write_checkouts,read_customers,write_customers,read_online_store_pages,write_online_store_pages,read_orders,read_product_listings,read_products,write_script_tags,read_themes,write_themes
SHOPIFY_APP_URL=https://your-app-url.com
DATABASE_URL=file:./dev.sqlite
```

### 4. Set Up Database

Initialize the Prisma database:

```bash
npm run prisma:generate
npm run prisma:push
```

### 5. Configure Shopify App

Update `shopify.app.toml` with your app information:

```toml
name = "ecomin-connector-and-forms"
client_id = "your_shopify_app_client_id"
application_url = "https://your-app-url.com"
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

This will:
- Start the Shopify CLI dev server
- Launch your app with hot-reload enabled
- Create a tunnel for testing

## 📦 Project Structure

```
ecomin-connector-and-forms/
├── app/
│   ├── components/
│   │   ├── settings/
│   │   │   ├── GeneralSettings.jsx
│   │   │   ├── PixelsSettings.jsx
│   │   │   └── EcominAPISettings.jsx
│   │   ├── CODFormTab.jsx
│   │   ├── SalesBoosterTab.jsx
│   │   └── SettingsTab.jsx
│   ├── routes/
│   │   ├── app._index.jsx          # Main dashboard
│   │   ├── app.jsx                 # App layout wrapper
│   │   ├── auth.$.jsx              # Auth handler
│   │   ├── auth.login/
│   │   │   └── route.jsx           # Login page
│   │   ├── api.webhooks.jsx        # Webhook handler
│   │   └── api.ecomin.credentials.jsx  # Ecomin API
│   ├── db.server.js                # Prisma client
│   ├── shopify.server.js           # Shopify app config
│   ├── entry.client.jsx            # Client entry
│   ├── entry.server.jsx            # Server entry
│   └── root.jsx                    # Root component
├── prisma/
│   └── schema.prisma               # Database schema
├── scripts/
│   └── generate_ecomin_credentials.js  # Test script
├── .env.example
├── .gitignore
├── package.json
├── shopify.app.toml
├── tsconfig.json
├── vite.config.js
└── README.md
```

## 🔑 Ecomin API Integration

### Generating Credentials

1. Navigate to **Settings & Integration** → **Ecomin API**
2. Click **Generate New Credentials**
3. Your secure API credentials will be displayed:
   - **API Key**: Starts with `ek_` (16 hex characters)
   - **API Secret**: Starts with `sk_` (64 hex characters)

### Using Credentials

Include these headers in your API requests to Ecomin services:

```javascript
fetch('https://api.ecomin.com/endpoint', {
  headers: {
    'X-API-Key': 'ek_xxxxxxxxxxxxxxxx',
    'X-API-Secret': 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json'
  }
});
```

### Testing Credential Generation

Run the standalone test script:

```bash
npm run test:credentials
```

This script will:
- Generate multiple credential sets
- Verify format correctness
- Check uniqueness
- Display security information

## 🔐 Security

### API Credentials

- **API Keys** (`ek_*`): Safe for client-side use
- **API Secrets** (`sk_*`): Must be kept secure, never expose publicly
- All credentials use cryptographically secure random generation
- Credentials are unique per shop
- Old credentials are replaced when regenerating

### Data Storage

- Credentials stored in SQLite database with Prisma ORM
- Session data managed by Shopify session storage
- Automatic cleanup on app uninstall

## 📚 API Endpoints

### GET `/api/ecomin/credentials`

Retrieve existing API credentials for the authenticated shop.

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "apiKey": "ek_xxxxxxxxxxxxxxxx",
    "apiSecret": "sk_xxxxxx...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Not Found - 404)**:
```json
{
  "success": false,
  "error": "No credentials found",
  "message": "No API credentials have been generated for this shop yet."
}
```

### POST `/api/ecomin/credentials`

Generate new API credentials for the authenticated shop.

**Response (Success - 201)**:
```json
{
  "success": true,
  "data": {
    "apiKey": "ek_xxxxxxxxxxxxxxxx",
    "apiSecret": "sk_xxxxxx...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "API credentials generated successfully!"
}
```

## 🧪 Testing

### Manual Testing

1. Install the app on a development store
2. Navigate through all tabs and features
3. Test credential generation and retrieval
4. Verify error handling by simulating network issues

### Automated Testing

```bash
# Run credential generation test
npm run test:credentials
```

## 🚀 Deployment

### Deploy to Shopify

```bash
npm run deploy
```

### Deploy to Other Hosting Providers

The app can be deployed to various platforms:

- **Heroku**: Use the Node.js buildpack
- **Vercel**: Configure build settings for Remix
- **Railway**: Simple deployment with automatic builds
- **Render**: Deploy with Docker or native Node.js

### Environment Variables

Ensure all required environment variables are set in your hosting platform:
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SCOPES`
- `SHOPIFY_APP_URL`
- `DATABASE_URL`

## 📖 Shopify Scopes

The app requires the following scopes:

- `write_checkouts` - Manage checkout configurations
- `read_customers` / `write_customers` - Access customer data
- `read_online_store_pages` / `write_online_store_pages` - Manage store pages
- `read_orders` - Access order information
- `read_product_listings` / `read_products` - Access product data
- `write_script_tags` - Add custom scripts
- `read_themes` / `write_themes` - Manage theme assets

## 🔄 Webhooks

The app listens to the following webhooks:

- **app/uninstalled**: Cleanup shop data and credentials on app uninstall
- **app/scopes_update**: Handle scope changes

## 🐛 Troubleshooting

### Database Issues

```bash
# Reset database
npm run prisma:push

# Regenerate Prisma client
npm run prisma:generate
```

### Authentication Issues

1. Verify your `.env` file has correct credentials
2. Check `shopify.app.toml` configuration
3. Ensure your app URL matches the configuration

### API Timeout Issues

- Default timeout is 30 seconds
- Check network connectivity
- Verify API endpoints are accessible

## 📝 Development Best Practices

- Always use environment variables for sensitive data
- Follow Shopify app development guidelines
- Implement proper error handling for all API calls
- Use loading states for better UX
- Log important events for debugging
- Keep credentials secure and never commit them

## 🛣️ Roadmap

### Phase 1 (Current)
- ✅ Basic app structure
- ✅ Ecomin API integration
- ✅ Settings and configuration UI

### Phase 2 (Coming Soon)
- COD form builder implementation
- Sales booster tools
- Pixel tracking integration

### Phase 3 (Future)
- Advanced analytics dashboard
- A/B testing framework
- Multi-language support
- Advanced customization options

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Contact: support@ecomin.com
- Documentation: https://docs.ecomin.com

## 🙏 Acknowledgments

- Built with [Shopify App Template](https://shopify.dev/docs/apps/tools/cli)
- UI powered by [Shopify Polaris](https://polaris.shopify.com/)
- Routing with [Remix](https://remix.run/)
- Database management with [Prisma](https://www.prisma.io/)

---

**Made with ❤️ for Shopify merchants**
