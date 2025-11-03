# Vercel Deployment Guide

## Environment Variables Setup

Before deploying to Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **MONGODB_URI** (Required)
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`
   - Get this from: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **JWT_SECRET** (Required)
   - A strong, random secret key for JWT token signing
   - Example: Generate using: `openssl rand -base64 32`
   - Must be kept secret and never exposed

### Optional Environment Variables

3. **GMAIL_USER** (Optional)
   - Your Gmail address for sending emails
   - Example: `your-email@gmail.com`
   - If not set, emails will be logged to console instead

4. **GMAIL_APP_PASSWORD** (Optional)
   - Gmail App Password (not your regular Gmail password)
   - Get this from: [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Required if you want to send actual emails

5. **NODE_ENV** (Optional)
   - Set to `production` for production environment
   - Vercel sets this automatically

## How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the sidebar
4. Add each variable:
   - **Key**: Variable name (e.g., `MONGODB_URI`)
   - **Value**: The actual value
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

## Deployment Steps

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Connect your GitHub repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see above)
   - Click "Deploy"

3. Vercel will automatically:
   - Install dependencies using Bun
   - Build your SvelteKit application
   - Deploy to production

## Build Configuration

The project uses:
- **Framework**: SvelteKit
- **Build Command**: `bun run build`
- **Output Directory**: `.svelte-kit` (auto-detected)
- **Install Command**: `bun install`

## Troubleshooting

### Build Fails with "MONGODB_URI is not exported"
- Make sure you've added `MONGODB_URI` to your Vercel environment variables
- Check that the variable is available in all environments (Production, Preview, Development)

### JWT Token Issues
- Ensure `JWT_SECRET` is set in Vercel environment variables
- The secret should be the same across all deployments to maintain token consistency

### Email Not Sending
- Check if `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correctly set
- If not configured, emails will be logged to console (visible in Vercel logs)
- To enable email: Set up Gmail App Password and add both variables to Vercel

### MongoDB Connection Fails
- Verify your MongoDB connection string is correct
- Make sure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) for serverless
- Check MongoDB Atlas firewall/network access settings

## Post-Deployment

After successful deployment:

1. **Create Admin User**: Run the admin creation script locally:
   ```bash
   bun run scripts/create-admin.ts
   ```

2. **Test the Application**:
   - Visit your Vercel deployment URL
   - Test login/signup functionality
   - Verify database connections work

3. **Monitor Logs**: Check Vercel deployment logs for any runtime errors

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

## Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel
