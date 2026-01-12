# Contributing to Ecomin Connector and Forms

Thank you for your interest in contributing to Ecomin Connector and Forms! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

We welcome contributions in the form of:

- Bug reports
- Feature requests
- Code contributions
- Documentation improvements
- UI/UX enhancements

## 📋 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ecomin-connector-and-forms.git
cd ecomin-connector-and-forms
```

### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up database
npm run prisma:generate
npm run prisma:push

# Start development server
npm run dev
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 💻 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

**Key principles:**
- Use meaningful variable and function names
- Write comments for complex logic
- Follow React best practices
- Use Shopify Polaris components consistently

### Commit Messages

Follow the conventional commits specification:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(api): add credential validation"
git commit -m "fix(ui): resolve loading state issue in EcominAPISettings"
git commit -m "docs(readme): update installation instructions"
```

### Code Structure

```
app/
├── components/        # Reusable React components
├── routes/           # Remix routes (pages and API endpoints)
├── utils/            # Utility functions
├── styles/           # Custom styles (if needed)
└── types/            # TypeScript type definitions
```

### Component Guidelines

**React Components:**
- Use functional components with hooks
- Keep components small and focused
- Use Polaris components for consistency
- Implement proper error boundaries

**Example:**
```jsx
import { BlockStack, Text, Button } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  const handleAction = useCallback(() => {
    // Implementation
  }, []);

  return (
    <BlockStack gap="400">
      <Text variant="headingMd">{prop1}</Text>
      <Button onClick={handleAction}>{prop2}</Button>
    </BlockStack>
  );
}
```

### API Endpoint Guidelines

**Follow this structure:**
```javascript
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET endpoint
export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);
    
    // Implementation
    
    return json({ success: true, data }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error:", error);
    return json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST endpoint
export async function action({ request }) {
  // Implementation
}
```

### Database Changes

When modifying the database schema:

1. Update `prisma/schema.prisma`
2. Generate migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```
3. Test the migration thoroughly
4. Document the changes

### Testing

Before submitting a PR:

1. **Manual testing:**
   - Test all affected features
   - Test on different browsers
   - Test error scenarios

2. **Automated testing:**
   ```bash
   npm run test:credentials
   ```

3. **Check for errors:**
   - Review console logs
   - Check network requests
   - Verify database operations

## 🐛 Reporting Bugs

### Before Submitting

1. Search existing issues to avoid duplicates
2. Verify the bug exists in the latest version
3. Collect relevant information

### Bug Report Template

```markdown
**Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Safari]
- Node version: [e.g., 18.0.0]
- App version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information.
```

## ✨ Requesting Features

### Feature Request Template

```markdown
**Problem Statement**
Describe the problem this feature would solve.

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Mockups, examples, or other context.

**Priority**
Low / Medium / High
```

## 🔍 Code Review Process

### For Contributors

1. Ensure your code follows the guidelines
2. Update documentation if needed
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

### Pull Request Template

```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Dependent changes merged

**Testing**
Describe how you tested your changes.

**Screenshots**
If applicable, add screenshots.

**Related Issues**
Fixes #(issue number)
```

### For Reviewers

When reviewing PRs:

1. Check code quality and style
2. Verify functionality
3. Test edge cases
4. Review security implications
5. Provide constructive feedback

## 🎯 Areas for Contribution

### High Priority

- **COD Form Builder**: Implementation needed
- **Sales Booster Tools**: Feature development
- **Pixel Integration**: Facebook/TikTok/Google Analytics
- **Test Coverage**: Unit and integration tests
- **Performance Optimization**: Loading times, bundle size

### Medium Priority

- **Documentation**: Tutorials, examples, API docs
- **UI/UX Improvements**: Better user experience
- **Accessibility**: WCAG compliance
- **Internationalization**: Multi-language support

### Good First Issues

Look for issues labeled `good first issue` for beginner-friendly tasks:

- Documentation updates
- Minor bug fixes
- UI improvements
- Code refactoring

## 📚 Resources

### Shopify Development

- [Shopify App Development Docs](https://shopify.dev/docs/apps)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Shopify API Reference](https://shopify.dev/api)

### Technologies Used

- [React](https://react.dev/)
- [Remix](https://remix.run/)
- [Prisma](https://www.prisma.io/)
- [Vite](https://vitejs.dev/)

## 🎓 Learning Resources

New to Shopify app development? Check out:

1. [Shopify App Development Tutorial](https://shopify.dev/docs/apps/getting-started)
2. [React Documentation](https://react.dev/learn)
3. [Remix Tutorial](https://remix.run/docs/en/main/tutorials/blog)

## 💬 Community

- **Questions?** Open a discussion on GitHub
- **Chat:** Join our community chat (if available)
- **Updates:** Watch the repository for updates

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behavior:**
- Harassment of any kind
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Instances of abusive behavior may be reported to the project maintainers. All complaints will be reviewed and investigated.

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Significant contributions may lead to:
- Collaborator status
- Maintainer role

## ❓ Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues
3. Open a discussion
4. Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🎉**

Your contributions help make this project better for everyone.
