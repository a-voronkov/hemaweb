# Email Setup Guide

HemaWeb uses **Mailjet** for sending transactional emails in production.

## Mailjet Setup

### 1. Create Mailjet Account

1. Go to [Mailjet](https://www.mailjet.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Credentials

1. Log in to [Mailjet Dashboard](https://app.mailjet.com/)
2. Go to **Account Settings** → **API Keys**
3. Copy your **API Key** and **Secret Key**

### 3. Verify Sender Domain

To send emails from `noreply@hemaweb.world`:

1. Go to **Account Settings** → **Sender Domains**
2. Click **Add a Domain**
3. Enter `hemaweb.world`
4. Follow the DNS verification steps:
   - Add TXT record for SPF
   - Add TXT record for DKIM
   - Wait for verification (can take up to 24 hours)

### 4. Configure Environment Variables

Add to `.env` on production server:

```env
# Mailjet API
MAILJET_API_KEY=your_api_key_here
MAILJET_SECRET_KEY=your_secret_key_here
EMAIL_FROM=noreply@hemaweb.world
EMAIL_FROM_NAME=HemaWeb
```

## Email Templates

The application sends three types of emails:

### 1. Verification Email
- **Subject:** "Verify your email - HemaWeb"
- **Trigger:** User registration
- **Contains:** Verification link (expires in 24 hours)

### 2. Password Reset Email
- **Subject:** "Reset your password - HemaWeb"
- **Trigger:** Password reset request
- **Contains:** Reset link (expires in 1 hour)

### 3. Welcome Email
- **Subject:** "Welcome to HemaWeb!"
- **Trigger:** Email verification success
- **Contains:** Getting started information

## Development Mode

In development (when Mailjet is not configured):
- Emails are sent via **Ethereal Email** (fake SMTP)
- Preview URLs are logged to console
- No real emails are sent

## SMTP Fallback

If you prefer SMTP over Mailjet API:

```env
# SMTP Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_smtp_user
EMAIL_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@hemaweb.world
EMAIL_FROM_NAME=HemaWeb
```

## Testing

### Test Email Verification

```bash
# Register a new user
curl -X POST https://hemaweb.world/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+66812345678"
  }'

# Check Mailjet dashboard for sent email
# Or check server logs for verification token
```

### Test Password Reset

```bash
# Request password reset
curl -X POST https://hemaweb.world/api/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Check Mailjet dashboard for sent email
```

## Monitoring

### Mailjet Dashboard

Monitor email delivery in Mailjet:
1. Go to [Statistics](https://app.mailjet.com/stats)
2. View sent, delivered, opened, clicked emails
3. Check bounce and spam reports

### Application Logs

Check API logs for email sending:

```bash
# On server
docker compose logs api | grep "Email sent"
```

## Troubleshooting

### Emails not sending

1. **Check API credentials:**
   ```bash
   # On server
   cat .env | grep MAILJET
   ```

2. **Check domain verification:**
   - Go to Mailjet → Sender Domains
   - Ensure `hemaweb.world` is verified

3. **Check application logs:**
   ```bash
   docker compose logs api --tail 100
   ```

### Emails going to spam

1. **Verify SPF and DKIM records:**
   ```bash
   dig TXT hemaweb.world
   dig TXT mailjet._domainkey.hemaweb.world
   ```

2. **Check sender reputation:**
   - Go to Mailjet → Statistics
   - Monitor bounce and spam rates

3. **Warm up your domain:**
   - Start with low volume
   - Gradually increase sending

## Best Practices

1. **Monitor bounce rates** - Keep below 5%
2. **Use double opt-in** - Email verification is mandatory
3. **Provide unsubscribe** - For marketing emails (not transactional)
4. **Keep templates simple** - Avoid spam triggers
5. **Test before deploying** - Use development mode

## Support

- **Mailjet Support:** https://www.mailjet.com/support/
- **Mailjet Documentation:** https://dev.mailjet.com/
- **HemaWeb Issues:** https://github.com/a-voronkov/hemaweb/issues

