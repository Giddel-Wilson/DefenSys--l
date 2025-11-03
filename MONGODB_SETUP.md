# MongoDB Connection Issue - Solutions

## Problem
Your MongoDB Atlas cluster DNS is not resolving. This could mean:
- The cluster was deleted or paused
- The hostname is incorrect
- Network/DNS issues

## Solutions (Choose ONE)

### Option 1: Get New MongoDB Atlas Connection String (RECOMMENDED)

1. Go to https://cloud.mongodb.com/
2. Log in with your credentials
3. Navigate to your cluster (or create a new free cluster if needed)
4. Click **"Connect"** button
5. Select **"Drivers"** → **"Node.js"**
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database`)
7. Update your `.env` file with the new connection string

### Option 2: Install MongoDB Locally (For Development)

#### On macOS (using Homebrew):
```bash
# Install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Update .env file to:
MONGODB_URI=mongodb://localhost:27017/defensys
```

#### On macOS (using Docker):
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env file to:
MONGODB_URI=mongodb://localhost:27017/defensys
```

### Option 3: Create a FREE MongoDB Atlas Cluster

If you don't have a cluster:

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a **FREE M0 cluster** (512MB storage, free forever)
4. Set up a database user:
   - Username: `defensys_user`
   - Password: (choose a strong password)
5. Add your IP to the IP whitelist:
   - Go to **Network Access**
   - Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for development
6. Get the connection string:
   - Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string
7. Update `.env` with the new connection string

### Quick Fix: Try URL-Encoded Password

Your password `10.Flash.01` contains a dot which might need encoding:

```env
MONGODB_URI=mongodb+srv://giddelwilson:10%2EFlash%2E01@cluster0.9u7m3eg.mongodb.net/defensys?retryWrites=true&w=majority
```

## After Fixing

1. Save the `.env` file
2. Restart your development server:
   ```bash
   # Stop the current server (Ctrl+C)
   bun dev
   ```
3. The MongoDB connection should work!

## Need Help?

If you're still stuck, check:
- MongoDB Atlas Dashboard: Are there any cluster status issues?
- Network: Can you access other websites?
- Firewall: Is your network blocking MongoDB ports (27017)?
