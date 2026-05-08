# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in StudyBridge, please do NOT open a public GitHub issue. Instead, please report it responsibly by emailing security@studybridge.dev or contacting the maintainers directly.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We appreciate responsible disclosure and will acknowledge your report within 48 hours.

## Security Best Practices

When using StudyBridge in production:

### Backend Security

1. **Environment Variables**: Store sensitive data in `.env` files (not in code)
2. **Database**: Use strong, unique passwords for MongoDB
3. **Authentication**: Enable JWT and use strong secrets
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS properly for your domain
6. **Rate Limiting**: Enable rate limiting on production
7. **Input Validation**: Always validate and sanitize user input
8. **Dependencies**: Keep dependencies updated

### Frontend Security

1. **HTTPS**: Always use HTTPS
2. **CSP**: Implement Content Security Policy headers
3. **XSS Protection**: Use proper escaping for user input
4. **CSRF Protection**: Use CSRF tokens for state-changing operations
5. **Secrets**: Never commit API keys or secrets
6. **Dependencies**: Keep dependencies updated

### Database Security

1. **MongoDB Atlas**: Enable network access restrictions
2. **IP Whitelisting**: Restrict database access to known IPs
3. **Authentication**: Use strong credentials
4. **Backups**: Regular automated backups
5. **Encryption**: Enable encryption at rest and in transit

### Deployment Security

1. **Firewall**: Configure firewalls properly
2. **SSL/TLS**: Use valid SSL certificates
3. **Headers**: Set security headers (X-Frame-Options, etc.)
4. **Logging**: Log security events
5. **Monitoring**: Monitor for suspicious activity
6. **Updates**: Keep server OS and software updated

## Supported Versions

Security updates are provided for:

- Current major version: Full support
- Previous major version: 6 months of support
- Older versions: No support (upgrade recommended)

## Security Updates

Security updates are released as patches and may be released outside of regular release schedules.

Subscribe to security advisories for immediate notifications:
- GitHub Security Advisories
- npm Package Warnings

## Dependencies

We use Snyk and npm audit to monitor dependencies for vulnerabilities:

```bash
npm audit
npm audit fix
```

## Responsible Disclosure

We follow responsible disclosure practices:

1. Vulnerabilities are not publicly disclosed until fixes are available
2. A security advisory is released with the fix
3. Credit is given to reporters (if desired)
4. The fix is included in a new release

## Contact

- **Security Email**: security@studybridge.dev
- **GitHub**: [@richardfacman](https://github.com/richardfacman)

---

**Thank you for helping keep StudyBridge secure!**
