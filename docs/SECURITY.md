# Security Guidelines

## Authentication & Authorization

### JWT Security
- Use strong JWT_SECRET (minimum 32 characters)
- Set appropriate expiration times (default 7 days)
- Implement token refresh mechanism
- Store tokens securely on client side

### Telegram WebApp Security
- Verify Telegram data signature
- Validate timestamp to prevent replay attacks
- Use HTTPS only for Mini App
- Never trust client-provided data

### Admin Authorization
- Use ADMIN_IDS environment variable
- Verify admin status on every protected endpoint
- Log all admin actions
- Implement role-based access control (RBAC)

## Data Protection

### Database Security
```sql
-- Create separate user for app
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Encrypt sensitive columns
ALTER TABLE users ADD COLUMN password_hash TEXT;

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### Password Security
- Hash passwords with bcryptjs (already implemented)
- Use salt rounds ≥ 10
- Never log passwords
- Implement password reset mechanism

### Sensitive Data
- Bank account numbers should be masked in logs
- API responses should not include secrets
- Use parameterized queries (already done)
- Enable database encryption at rest

## Input Validation

### All endpoints must validate:
```javascript
// Example validation
const schema = Joi.object({
  amount: Joi.number().positive().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/^\d{10,15}$/)
});
```

### File Upload Security
- Limit file size to 50MB
- Validate MIME types
- Scan for malware
- Store outside webroot
- Use random filenames

## Rate Limiting

```javascript
// Already configured in middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests'
});
```

## API Security

### HTTPS/TLS
- Enforce HTTPS in production
- Use strong TLS 1.2+
- Update certificates regularly
- Use HSTS header

### CORS
```javascript
app.use(cors({
  origin: ['https://app.novavest.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

### HTTP Headers
```javascript
// Use helmet middleware
import helmet from 'helmet';
app.use(helmet());

// Additional headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

## SQL Injection Prevention

✅ Already protected - using parameterized queries:
```javascript
// ✅ SAFE
const result = await query(
  'SELECT * FROM users WHERE id = $1',
  [userId]  // Parameter passed separately
);

// ❌ UNSAFE - Never do this
const result = await query(`SELECT * FROM users WHERE id = ${userId}`);
```

## XSS Protection

```javascript
// Sanitize user input
const DOMPurify = require('isomorphic-dompurify');
const clean = DOMPurify.sanitize(userInput);

// Use parameterized queries for database
// React will escape by default
```

## Error Handling

```javascript
// ✅ Good - No sensitive info leaked
catch (error) {
  logger.error({ message: 'Database error', error: error.message });
  res.status(500).json({
    success: false,
    message: 'An error occurred'
  });
}

// ❌ Bad - Leaks sensitive info
catch (error) {
  res.status(500).json({ error: error.stack });
}
```

## Logging & Monitoring

### What to log:
- Authentication attempts
- Admin actions
- Failed transactions
- Large withdrawals
- Error conditions

### What NOT to log:
- Passwords
- Bank account numbers
- JWT tokens
- API keys
- PII (Personal Identifiable Information)

### Logging Setup
```javascript
import logger from 'pino';

logger.info({ 
  action: 'deposit_approved',
  userId: user.id,  // OK
  amount: 50000,    // OK
  // DO NOT LOG: bankAccount, password, token
});
```

## Fraud Prevention

### Duplicate Prevention
```javascript
// Check for recent similar transactions
const recent = await query(
  `SELECT * FROM deposits 
   WHERE user_id = $1 
   AND amount = $2 
   AND created_at > NOW() - INTERVAL '1 hour'`,
  [userId, amount]
);

if (recent.rows.length > 0) {
  throw new Error('Duplicate deposit attempt');
}
```

### Suspicious Activity Detection
- Multiple failed login attempts
- Unusual withdrawal amounts
- Multiple deposits from same IP
- Rapid referral signups
- High-velocity transactions

## Compliance

### Data Retention
- Keep transaction history for 7 years
- Archive old records regularly
- Implement data deletion on user request (GDPR)

### KYC/AML
- Collect KYC information
- Verify identity
- Monitor for suspicious patterns
- Report to authorities if required

## Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] Strong JWT_SECRET set
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Parameterized SQL queries
- [ ] Error messages don't leak sensitive info
- [ ] Admin actions logged
- [ ] Database backups configured
- [ ] Regular security updates
- [ ] Helmet middleware enabled
- [ ] Environment variables secured
- [ ] API keys rotated regularly
- [ ] Database encryption enabled
- [ ] Access logs monitored
- [ ] Dependency vulnerabilities checked

## Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Use specific versions
npm ci  # Instead of npm install
```

## Incident Response

1. Isolate the affected system
2. Preserve logs and evidence
3. Assess the scope
4. Notify affected users
5. Patch the vulnerability
6. Deploy fix
7. Monitor for recurrence
8. Post-incident review
