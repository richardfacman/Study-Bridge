# Contributing to StudyBridge

Thank you for your interest in contributing to StudyBridge! This document provides guidelines and instructions for contributing to our project.

## 🙋 Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Study-Bridge.git
   cd Study-Bridge
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Set up your development environment**:
   ```bash
   npm run install-all
   ```

## 📝 Commit Guidelines

We follow conventional commits for clear, semantic commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tools
- **ci**: CI/CD configuration changes

### Examples

```
feat(auth): implement OAuth2 Google authentication

This adds Google OAuth2 support to the authentication system.
Users can now sign up and log in using their Google accounts.

Closes #123
```

```
fix(scholarship): correct filter by country
```

## 🔧 Code Standards

### Backend (Node.js/Express)

- Use ES6+ syntax
- Follow ESLint configuration in `.eslintrc.json`
- Use async/await over callbacks
- Add JSDoc comments for functions
- Write meaningful variable and function names

```javascript
/**
 * Get university by ID
 * @param {string} id - University ID
 * @returns {Promise<Object>} University data
 */
async function getUniversityById(id) {
  // Implementation
}
```

### Frontend (React)

- Use functional components with hooks
- Use PascalCase for component names
- Write meaningful prop names
- Add prop-types or TypeScript types
- Use semantic HTML

```javascript
/**
 * UniversityCard - Display university information
 * @component
 * @param {Object} props
 * @param {string} props.name - University name
 * @param {string} props.country - University country
 */
function UniversityCard({ name, country }) {
  return (
    <div className="university-card">
      {/* Component content */}
    </div>
  );
}
```

## 🧪 Testing

- Write tests for new features
- Maintain or improve code coverage
- Run tests before submitting PR

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📋 Pull Request Process

1. **Update your branch**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what was changed and why
   - Reference any related issues (#123)
   - Screenshots for UI changes
   - Test instructions

4. **PR Title Format**:
   ```
   [Type] Brief description
   
   Examples:
   [Feature] Add university comparison tool
   [Fix] Correct scholarship filter by country
   [Docs] Update API documentation
   ```

5. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Related Issues
   Closes #(issue number)
   
   ## Testing
   Instructions for testing the changes
   
   ## Screenshots
   (if applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-reviewed my own code
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests passing
   ```

## 🔍 Code Review Process

All submissions require review. We use GitHub's review feature:

1. A maintainer will review your PR
2. Changes may be requested
3. Once approved, your PR will be merged

Please be patient and responsive during the review process.

## 📚 Documentation

- Keep documentation up to date
- Add comments for complex logic
- Update README if adding major features
- Document API endpoints in `API_DOCUMENTATION.md`

## 🐛 Reporting Bugs

When reporting bugs, include:

- **Environment**: OS, Node version, Browser (if applicable)
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots or error logs**
- **Possible solution** (optional)

Example:
```
## Bug Report: Application filter not working

### Environment
- OS: Windows 10
- Node: v16.13.0
- Browser: Chrome 95

### Steps to Reproduce
1. Click "Filter" button
2. Select "Status: Accepted"
3. Observe the list

### Expected Behavior
List should show only accepted applications

### Actual Behavior
List shows all applications regardless of filter

### Error Log
(attach any error logs)
```

## 💡 Feature Requests

Before requesting features:
- Check existing issues to avoid duplicates
- Provide clear use case and benefits
- Include mockups/examples if applicable

Template:
```
## Feature Request: [Brief Title]

### Use Case
Why do we need this?

### Proposed Solution
How should it work?

### Alternatives
Other approaches?

### Additional Context
Any other relevant information
```

## 📦 Development Setup

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
# Seed sample data
cd backend
npm run seed

# Reset database
npm run seed:reset
```

## 🚢 Deployment

Only maintainers can deploy. Changes are automatically deployed when merged to main:

- **Staging**: `develop` branch
- **Production**: `main` branch

## 📖 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## ❓ Questions?

- Create a discussion on GitHub
- Open an issue with your question
- Check existing documentation

## 🎉 Thank You!

Your contributions help make StudyBridge better for students worldwide. We appreciate your effort!

---

**Happy coding!** 🚀
