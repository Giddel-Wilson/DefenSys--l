# EmailJS Setup for DefenSys (2 Minutes!)

## Why EmailJS?

✅ **100% FREE** - 200 emails/month for free, forever
✅ **NO verification needed** - Send to ANY email immediately
✅ **2-minute setup** - Literally the easiest email service
✅ **No credit card** - Completely free tier
✅ **Works instantly** - No domain verification, no recipient verification

## Quick Setup (2 Minutes!)

### Step 1: Sign Up (30 seconds)
1. Go to: https://www.emailjs.com/
2. Click "Sign Up Free"
3. Use your email (giddel100@gmail.com)
4. Verify your email

### Step 2: Add Email Service (1 minute)
1. After login, go to: https://dashboard.emailjs.com/admin
2. Click "Add New Service"
3. Choose **Gmail** (easiest)
4. Click "Connect Account" and sign in with your Gmail
5. Copy the **Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Template (30 seconds)
1. Go to: https://dashboard.emailjs.com/admin/templates
2. Click "Create New Template"
3. Use this template:
   ```
   Subject: {{subject}}
   
   To: {{to_email}}
   
   {{message}}
   ```
4. Save the template
5. Copy the **Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Your Keys (30 seconds)
1. Go to: https://dashboard.emailjs.com/admin/account
2. Copy your **Public Key**
3. Copy your **Private Key** (click "Generate Private Key" if needed)

### Step 5: Update .env File
Open `.env` and add:
```bash
EMAILJS_PUBLIC_KEY=your-public-key-here
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx
EMAILJS_PRIVATE_KEY=your-private-key-here
```

### Step 6: Restart & Test
```bash
# Stop server (Ctrl+C)
bun dev

# Send a test message - it will arrive immediately! 📧
```

## Why This Works Better

| Resend | EmailJS |
|--------|---------|
| Must verify recipients | ✅ Send to anyone |
| Must verify domain | ✅ No verification |
| Only 100 emails/day | ✅ 200 emails/month |
| Complex setup | ✅ 2-minute setup |

## Free Tier Limits

- ✅ 200 emails per month
- ✅ Send to ANY email address
- ✅ No credit card required
- ✅ No recipient verification
- ✅ No domain verification
- ✅ Forever free

## Support

- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/
