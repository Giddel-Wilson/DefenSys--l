# Email Configuration for DefenSys

## Overview

DefenSys uses email notifications to alert administrators when users submit messages through the "Contact Administrator" form.

**We use EmailJS** - the simplest, most reliable email service that requires ZERO verification!

## Setup Instructions

### 1. Sign Up for EmailJS (FREE - 30 seconds)

1. Go to: **https://www.emailjs.com/**
2. Click "Sign Up Free"
3. Verify your email

### 2. Connect Your Email Service (1 minute)

1. After login, go to: https://dashboard.emailjs.com/admin
2. Click "Add New Service"
3. Choose **Gmail** (easiest option)
4. Click "Connect Account" and authorize with your Gmail
5. Copy the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template (30 seconds)

1. Go to: https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Set the template content:
   - **Subject:** `{{subject}}`
   - **Body:** `{{message}}`
   - **To:** `{{to_email}}`
4. Save and copy the **Template ID** (e.g., `template_abc123`)

### 4. Get Your API Keys (30 seconds)

1. Go to: https://dashboard.emailjs.com/admin/account
2. Copy your **Public Key**
3. Click "Generate Private Key" and copy the **Private Key**

### 5. Configure Environment Variables

Add to your `.env` file:

```bash
EMAILJS_PUBLIC_KEY=your-public-key-here
EMAILJS_SERVICE_ID=service_abc123
EMAILJS_TEMPLATE_ID=template_abc123
EMAILJS_PRIVATE_KEY=your-private-key-here
```

### 6. Restart Your Server

```bash
bun dev
```

### 7. Test It!

Send a message from your dashboard - emails will arrive immediately! 📧

## Features

### User Side

- Submit messages to administrators via dashboard
- Form includes subject and message fields
- Confirmation notification on successful submission
- Messages are sent directly to admin emails (not stored in database)

### Admin Side

- Receives email notifications immediately when users submit messages
- All users with "admin" role receive the notifications
- Email includes:
  - User's name and email
  - Subject line
  - Full message content
  - Timestamp

## Why EmailJS?

✅ **100% FREE** - 200 emails/month forever
✅ **NO verification** - Send to ANY email immediately
✅ **2-minute setup** - Fastest email service ever
✅ **No credit card** - Completely free
✅ **Works instantly** - No waiting, no verification

## Free Tier Limits

- ✅ 200 emails per month
- ✅ Send to ANY email address (no verification required!)
- ✅ No credit card required
- ✅ No recipient verification needed
- ✅ No domain verification needed
- ✅ Perfect for development and small production

## Troubleshooting

### Not Receiving Emails?

- Check spam/junk folder
- Verify all 4 keys are correct in `.env`
- Check EmailJS dashboard for logs
- Make sure you connected Gmail service correctly

### Development Mode (No Keys Configured)

If you don't configure EmailJS, the system will:
- Log emails to the console instead of sending them
- Still return success to the user
- Perfect for local development without email setup

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com/

## Features

### User Side
- Submit messages to administrators via dashboard
- Form includes subject and message fields
- Confirmation notification on successful submission
- Messages are sent directly to admin emails (not stored in database)

### Admin Side
- Receives email notifications immediately when users submit messages
- All users with "admin" role receive the notifications
- Email includes:
  - User's name and email
  - Subject line
  - Full message content
  - Timestamp

## Using Your Own Domain (Optional)

To send emails from your own domain (e.g., `noreply@defensys.com`):

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `defensys.com`)
4. Add the provided DNS records to your domain registrar
5. Wait for verification (5-10 minutes)
6. Update your `.env`:
   ```bash
   RESEND_FROM_EMAIL=noreply@defensys.com
   ```

## Free Tier Limits

- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ No credit card required
- ✅ Perfect for development and small production deployments

## Troubleshooting

### API Key Not Working?
- Ensure you copied the complete key (starts with `re_`)
- Check for spaces before/after the key in `.env`
- Restart your dev server after updating `.env`

### Emails Not Arriving?
- Check spam/junk folders
- With free tier, delivery might take 1-2 minutes
- View logs at: https://resend.com/logs

### Development Mode (No API Key)
If you don't configure Resend, the system will:
- Log emails to the console instead of sending them
- Still return success to the user
- Perfect for local development without email setup

## Why Resend Over SMTP?

✅ **No complex configuration** - Just one API key
✅ **No firewall issues** - Works behind any network
✅ **No app passwords** - No 2FA setup needed
✅ **Better deliverability** - Professional infrastructure
✅ **Instant setup** - 5 minutes vs 30+ minutes for SMTP
✅ **Free tier** - More than enough for most applications

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support
- All messages stored in database

### Admin Side
- View all user messages at `/admin/messages`
- Messages organized by status (unread, read, responded)
- Search and filter capabilities
- Mark messages as read automatically when opened
- Respond to messages directly from the interface
- Email notifications sent when new messages arrive

### Email Notifications
When a user sends a message:
1. Message is stored in MongoDB
2. System fetches all admin users
3. Email notification sent to all admins
4. Email includes:
   - User name and email
   - Message subject
   - Full message content
   - Professional HTML formatting

## Fallback Behavior

If SMTP credentials are not configured:
- System will continue to work normally
- Messages will still be stored in database
- Admins can still view messages at `/admin/messages`
- Email notifications will be logged to console instead of sent
- No errors or disruptions to user experience

## Database Schema

### Message Model
```typescript
{
  userId: ObjectId,           // Reference to User
  userEmail: string,          // User's email
  userName: string,           // User's display name
  subject: string,            // Message subject
  message: string,            // Message content
  status: 'unread' | 'read' | 'responded',
  response: string?,          // Admin's response (optional)
  respondedBy: ObjectId?,     // Admin who responded
  respondedAt: Date?,         // Response timestamp
  createdAt: Date,            // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

## API Endpoints

### Submit Message
- **POST** `/api/messages`
- Body: `{ subject: string, message: string }`
- Authentication: Required (cookie-based)
- Returns: `{ success: boolean, messageId: string }`

### Get All Messages
- **GET** `/api/messages`
- Authentication: Required (cookie-based)
- Returns: All messages for regular users, all messages for admins

### Get Single Message
- **GET** `/api/messages/[id]`
- Authentication: Required (cookie-based)
- Returns: Message details

### Update Message
- **PATCH** `/api/messages/[id]`
- Body: `{ status?: string, response?: string }`
- Authentication: Required (admin only)
- Returns: `{ success: boolean }`

### Delete Message
- **DELETE** `/api/messages/[id]`
- Authentication: Required (admin only)
- Returns: `{ success: boolean }`

## Testing

### Test Without Email
1. Leave SMTP variables unconfigured
2. Submit a message through the dashboard
3. Check console logs for email content
4. Verify message appears in `/admin/messages`

### Test With Email
1. Configure SMTP variables
2. Submit a message
3. Check admin email inbox
4. Verify HTML formatting and content
5. Test response functionality

## Troubleshooting

### Emails Not Sending
1. Verify SMTP credentials are correct
2. Check that app password is used (not regular password)
3. Ensure SMTP port is correct (usually 587 or 465)
4. Check firewall/network settings
5. Review server logs for error messages

### Messages Not Appearing
1. Verify MongoDB connection
2. Check user authentication
3. Review browser console for errors
4. Confirm API endpoints are accessible

## Security Considerations

1. **Never commit** `.env` file to version control
2. Use app-specific passwords, not account passwords
3. Regularly rotate SMTP credentials
4. Limit admin access to authorized personnel only
5. Monitor message logs for suspicious activity
6. Use HTTPS in production for encrypted transmission

## Production Recommendations

1. Use a dedicated email service (SendGrid, Mailgun, etc.)
2. Set up email sending rate limits
3. Implement message retention policies
4. Add email template customization
5. Set up email delivery monitoring
6. Configure bounce/complaint handling
7. Add email queue for high-volume scenarios

## License
Part of DefenSys Security Platform
